import { User as UserModel, UserId, WithId } from "@pos/shared-models";
import { AppError } from "../utils/AppError";
import { User } from "../db-collections/user.collection";
import bcrypt from "@node-rs/bcrypt";
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserStatusInput,
} from "../schemas/user.schema";
import { AuthService } from "./auth.service";
import { db } from "../firebase";

export class UserService {
  async create(data: CreateUserInput, createdBy: UserId) {
    const now = new Date();
    const nData = {
      ...data,

      //additional info
      profileImage: null,
      shopId: null,
      shopRoles: null,

      //default
      isActive: true,
      createdAt: now,
      createdBy,
      updatedBy: createdBy,
      updatedAt: now,
      isDeleted: false,
      deletedBy: null,
      deletedAt: null,
    };
    const userObj = new User();
    const allUsers = await userObj.findAll();
    const newUserMobile = data.mobile ? data.mobile : "";
    const newUserEmail = data.email ? data.email : "";
    const errors = this.checkExistEmailNMobile(
      allUsers,
      newUserMobile,
      newUserEmail
    );
    if (errors.mobile.length || errors.email.length) {
      throw new AppError("Validation failed", 400, errors);
    }
    const customUserId = this.generateCustomuserId(allUsers, data.firstName);
    const { password, ...rest } = nData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const nUser = await userObj.create(
      { ...rest, password: hashedPassword },
      customUserId
    );
    const { password: dbHashedPassword, ...restData } =
      this.filterDocData(nUser);
    return restData;
  }
  async findOne(id: UserId) {
    try {
      const nUser = await new User().get(id);
      if (!nUser) {
        throw new AppError("User not found", 404);
      }
      return this.filterDocData(nUser);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in findOne:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  async update(id: UserId, newData: UpdateUserInput, updatedBy: UserId) {
    const { password, ...restNewData } = newData;
    try {
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;
      const dbUser = await this.findOne(id);

      //#region: validate for duplicate mobile or email
      if (newData.mobile && dbUser.mobile !== newData.mobile) {
        const userObj = new User();
        const allUsers = await userObj.findAll();
        const newUserMobile = newData.mobile ? newData.mobile : "";
        const newUserEmail = newData.email ? newData.email : "";
        const errors = this.checkExistEmailNMobile(
          allUsers,
          newUserMobile,
          newUserEmail,
          id
        );
        if (errors.mobile.length || errors.email.length) {
          throw new AppError("Validation failed", 400, errors);
        }
      }
      //#endregion
      const batch = db.batch();
      const now = new Date();
      new User().update(
        id,
        {
          ...restNewData,
          ...(hashedPassword && { password: hashedPassword }),
          updatedBy,
          updatedAt: now,
        },
        batch
      );
      if (newData.role && newData.role !== dbUser.role) {
        await new AuthService().deleteAllSession(id, batch);
      }
      await batch.commit();
      return restNewData;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in findOne:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  async updateStatus(
    id: UserId,
    data: UpdateUserStatusInput,
    updatedBy: UserId
  ) {
    try {
      const dbUser = await this.findOne(id);
      if (
        dbUser.isActive === data.isActive ||
        dbUser.isDeleted === data.isDeleted
      ) {
        throw new AppError("No change needed", 204); //Test working or not
      }
      const now = new Date();
      const batch = db.batch();
      const userObj = new User();
      userObj.update(
        id,
        {
          ...data,
          updatedBy,
          updatedAt: now,
          ...(data.isDeleted
            ? { deletedAt: now, deletedBy: updatedBy, isActive: false }
            : { deletedAt: null, deletedBy: null }),
        },
        batch
      );
      if (
        dbUser.isActive &&
        ((data.isActive != undefined && !data.isActive) ||
          (data.isDeleted != undefined && data.isDeleted))
      ) {
        await new AuthService().deleteAllSession(id, batch);
      }
      return await batch.commit();
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in findOne:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  async delete(id: UserId, deletedBy: UserId) {
    try {
      const nUser = await this.findOne(id);
      if (!nUser) {
        throw new AppError("User not found", 404);
      }
      return await new User().softDelete(id, deletedBy);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        console.error("Unexpected error in findOne:", err);
        throw new AppError(err.message || "Internal Server Error", 500);
      } else {
        throw new AppError("Unknown error occurred", 500);
      }
    }
  }
  private generateCustomuserId(
    usersData: WithId<UserModel>[],
    currentName: string
  ) {
    let filteredCurrentName = currentName.replace(/\s/g, "").toLowerCase(); // remove all white spaces n to lower case
    filteredCurrentName = filteredCurrentName.replace(/[^a-z]/gi, ""); // extract only alphabate characters
    const filteredUsers = usersData.filter((user) =>
      user.id.startsWith(filteredCurrentName)
    );
    const length = filteredUsers.length;
    if (length == 1) {
      return `${filteredCurrentName}${1}`;
    } else if (length > 1) {
      return `${filteredCurrentName}${length}`;
    } else {
      return filteredCurrentName;
    }
  }
  private checkExistEmailNMobile(
    usersData: WithId<UserModel>[],
    mobile = "",
    email = "",
    id = ""
  ) {
    const errors = { mobile: new Array<string>(), email: new Array<string>() };
    usersData.forEach((user) => {
      if (
        mobile &&
        user.mobile === mobile &&
        user.id !== id &&
        !errors.mobile.length
      ) {
        errors.mobile.push("Mobile number already exists");
      }
      if (
        email &&
        user.email === email &&
        user.id !== id &&
        !errors.email.length
      ) {
        errors.email.push("Email already exists");
      }
    });
    return errors;
  }
  private filterDocData(data: WithId<UserModel>) {
    const {
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      deletedAt,
      deletedBy,
      ...rest
    } = data;
    return rest;
  }
}
