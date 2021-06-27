import IBaseModel from "framework/documents/models/IBaseModel";
import IFIleModel from "framework/documents/models/IFileModel";

interface IWarehouseModel extends IBaseModel {
  /**
   * Warehouse name
   */
  name: string;

  /**
   * Avatar refer to file
   */
  avatar: IFIleModel;

  /**
   * Country code of warehouse
   */
  country: string;

  /**
   * City code of warehouse
   */
  city: string;

  /**
   * provinces code of warehouse
   */
  provinces: string;

  /**
   * Full address of warehouse
   */
  address: string;
}

export default IWarehouseModel;
