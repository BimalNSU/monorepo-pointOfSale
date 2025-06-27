import { User as UserModel, UserId, WithId } from "@pos/shared-models";
import { AppError } from "../AppError";
import { User } from "../db-collections/user.collection";
import bcrypt from "@node-rs/bcrypt";
import { CreateUserInput, UpdateUserStatusInput } from "../schemas/user.schema";
import { AuthService } from "./auth.service";
type omitType = "createdBy" | "updatedBy" | "deletedAt" | "deletedBy";
export type EditData = Omit<UserModel, omitType | "createdBy" | "createdAt">;

export class UserService {
  async create(data: CreateUserInput, createdBy: UserId) {
    const now = new Date();
    const nData = {
      ...data,

      //additional info
      gender: null,
      maritalStatus: null,
      religion: null,
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
    const errorMessage = this.checkExistEmailNMobile(
      allUsers,
      newUserMobile,
      newUserEmail
    );
    if (errorMessage.length) {
      throw new AppError(404, errorMessage);
    }
    const customUserId = this.generateCustomuserId(allUsers, data.firstName);
    const { password, ...rest } = nData;
    const hashedPassword = await bcrypt.hash(password ?? "", 10);
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
        throw new AppError(404, "Not found", `Invalid user ID #${id}`);
      }
      return this.filterDocData(nUser);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(err.message);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
  async findOneBy(fieldName: "mobile" | "email", fieldValue: string) {
    try {
      const nUser = await new User().findOneBy(fieldName, fieldValue);
      if (!nUser) {
        throw new AppError(404, "Not found", `Invalid user credential`);
      }
      return this.filterDocData(nUser);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(err.message);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
  async update(id: UserId, newData: Partial<EditData>, updatedBy: UserId) {
    const { password, ...restNewData } = newData as Partial<EditData>;
    try {
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;
      const dbUser = await this.findOne(id);
      const nUser = { ...dbUser, ...restNewData };
      await new User().update(id, {
        ...nUser,
        ...(hashedPassword && { password: hashedPassword }),
        updatedBy,
        updatedAt: new Date(),
      });
      const { password: dbHashedPassword, ...restUserData } = nUser;
      return restUserData;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(err.message);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
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
        throw new AppError(204, "No change needed"); //Test working or not
      }
      const userObj = new User();
      const now = new Date();
      await userObj.update(id, {
        ...data,
        updatedBy,
        updatedAt: now,
        ...(data.isDeleted
          ? { deletedAt: now, deletedBy: updatedBy, isActive: false }
          : { deletedAt: null, deletedBy: null }),
      });
      if (
        dbUser.isActive &&
        ((data.isActive != undefined && !data.isActive) ||
          (data.isDeleted != undefined && data.isDeleted))
      ) {
        await AuthService.deleteAllSession(id);
      }
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(err.message);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
      }
    }
  }
  async delete(id: UserId, updatedBy: UserId) {
    try {
      const nUser = await this.findOne(id);
      if (!nUser) {
        throw new AppError(404, `User ID #${id} isn't found`);
      }
      return await new User().softDelete(id, updatedBy);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else if (err instanceof Error) {
        // throw new Error(err.message);
        throw err; // TODO: convert to AppError with 500 error code
      } else {
        throw new Error(err as string);
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
    const error = new Array();
    usersData.forEach((user) => {
      if (mobile && user.mobile === mobile && user.id !== id) {
        error.push({ mobile: "Mobile number is already exists" });
      }
      if (email && user.email === email && user.id !== id) {
        error.push({ email: "Email is already exists" });
      }
    });
    return error;
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
