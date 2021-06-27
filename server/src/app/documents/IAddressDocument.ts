import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * Address document
 * @author tung.nguyenvan
 */
interface IAddressDocument extends IBaseDocument {
    /**
     * Address of store
     */
    address: string;

    /**
     * City of store
     */
    city: string;

    /**
     * district id
     */
    district: string;

    /**
     * Ward id
     */
    ward: string;
}

export default IAddressDocument;
