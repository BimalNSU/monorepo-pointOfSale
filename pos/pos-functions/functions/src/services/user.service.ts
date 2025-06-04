import { UserId } from "@pos/shared-models/dist/models/common.model";
import { AppError } from "../AppError";
import { db } from "../firebase";
import { COLLECTIONS } from "../constants/collections";
import { User as UserModel } from "@pos/shared-models/dist/models/user.model";
import { User } from "../db-collections/user.collection";
import bcrypt from "@node-rs/bcrypt";
type omitType =
  | "createdBy"
  | "createdAt"
  | "updatedBy"
  | "updatedAt"
  | "isDeleted"
  | "deletedAt"
  | "deletedBy";
export type MutableData = Omit<UserModel, omitType>;

const collectionRef = db.collection(COLLECTIONS.users);
export class UserService {
  async create(data: MutableData, createdBy: UserId) {
    const now = new Date();
    const nData = {
      ...data,
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const nUser = await userObj.create(
      { ...rest, password: hashedPassword },
      customUserId
    );
    const { password: dbHashedPassword, ...restData } = nUser;
    return restData;
  }
  async findOne(id: UserId) {
    try {
      const nUser = await new User().get(id);
      if (!nUser) {
        throw new AppError(404, "Not found", `Invalid user ID #${id}`);
      }
      return nUser;
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
      return nUser;
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
  async update(id: UserId, newData: Partial<MutableData>, updatedBy: UserId) {
    const { password, ...restNewData } = newData;
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
  async delete(id: UserId, updatedBy: UserId) {
    try {
      const nUser = await this.findOne(id);
      if (!nUser) {
        throw new AppError(404, `User ID #${id} isn't found`);
      }
      const now = new Date();
      return collectionRef.doc(id).set(
        {
          isDeleted: true,
          isActive: false,
          updatedBy,
          updatedAt: now,
          deletedBy: updatedBy,
          deletedAt: now,
        },
        { merge: true }
      );
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
    usersData: (MutableData & { id: UserId })[],
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
    usersData: (MutableData & { id: UserId })[],
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
}
