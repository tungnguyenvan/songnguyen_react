import IBaseModel from "./IBaseModel";

interface IFIleModel extends IBaseModel {
  /**
   * Url can get from clound storage
   */
  url: string;

  /**
   * File name has been storage at clound storage
   */
  filename: string;
}

export default IFIleModel;
