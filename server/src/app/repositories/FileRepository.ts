import BaseRepository from "@app/framework/core/BaseRepository";
import FileModel from "@app/app/models/FileModel";

/**
 * File repository
 * @author tung.nguyenvan
 */
class FileRepository extends BaseRepository {
	constructor() {
		super(new FileModel());
	}
}

export default FileRepository;
