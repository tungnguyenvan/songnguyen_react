import IBaseModel from "framework/documents/models/IBaseModel";
import IFIleModel from "framework/documents/models/IFileModel";
import IUserModel from "framework/documents/models/IUserModel";
import IWarehouseModel from "./IWarehouseModel";

interface IStoreModel extends IBaseModel {
  /**
   * Name of store
   */
  name: string;

  /**
   * Address of store
   */
  address: string;

  /**
   * Country of store
   */
  country: string;

  /**
   * City of store
   */
  city: string;

  /**
   * Avatar of store
   */
  avatar: IFIleModel;

  /**
   * List member of store
   */
  members: IUserModel[];

  /**
   * List warehouse of store
   */
  warehouses: IWarehouseModel[];
}

export default IStoreModel;
