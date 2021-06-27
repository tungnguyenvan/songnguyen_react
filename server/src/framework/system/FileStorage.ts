import Multer from "multer";
import Mongoose from "mongoose";
import Logging from "@app/framework/utils/Logging";
import express from "express";
import { Bucket } from "@google-cloud/storage";
import * as admin from "firebase-admin";
import * as serviceAccount from "@app/resource/firebaseServiceAccount.json";
import AppResponse from "./AppResponse";
import AppConfig from "./AppConfig";

const NAME_SPACE = "FileStorage";

class FileStorage {
	private firebaseApplication: admin.app.App;
	private storageBucket: Bucket;
	private fileFilter: (
		request: express.Request,
		file: Express.Multer.File,
		callback: Multer.FileFilterCallback
	) => void;
	private multerOption: Multer.Options;
	private appResponse: AppResponse;

	constructor() {
		// init firebase app
		this.firebaseApplication = admin.initializeApp({
			credential: admin.credential.cert({
				projectId: serviceAccount.project_id,
				clientEmail: serviceAccount.client_email,
				privateKey: serviceAccount.private_key,
			}),
		});
		this.appResponse = new AppResponse();

		this.storageBucket = this.firebaseApplication.storage().bucket(AppConfig.BUCKET_URL);

		// init file filter
		this.fileFilter = (
			request: express.Request,
			file: Express.Multer.File,
			callback: Multer.FileFilterCallback
		) => {
			if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
				callback(null, true);
			} else {
				callback(null, false);
			}
		};

		// init multer option
		this.multerOption = {
			storage: Multer.memoryStorage(),
			fileFilter: this.fileFilter,
			limits: {
				fileSize: 5 * 1024 * 1024,
			},
		};

		// binding
		this.upload = this.upload.bind(this);
		this.single = this.single.bind(this);
		this.getMulter = this.getMulter.bind(this);
	}

	getMulter(): Multer.Multer {
		return Multer(this.multerOption);
	}

	/**
	 * Upload single file to clound storage
	 * @param file
	 * @returns
	 */
	upload(file: Express.Multer.File): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!file) reject("No image");

			try {
				const newFileName = `${Date.now()}`;
				const fileUpload = this.storageBucket.file(newFileName);
				const accessToken = new Mongoose.Types.ObjectId();
				const blobStream = fileUpload.createWriteStream({
					metadata: {
						encoding: file.encoding,
						contentType: file.mimetype,
						firebaseStorageDownloadTokens: accessToken,
					},
				});

				blobStream.on("finish", () => {
					const url = `https://firebasestorage.googleapis.com/v0/b/${this.storageBucket.name}/o/${newFileName}?alt=media`;
					resolve({
						url,
						filename: newFileName,
					});
				});

				blobStream.on("error", (error) => {
					reject("Something is wrong! Unable to upload at the moment: " + error);
					Logging.error(NAME_SPACE, "FileStorage#upload", error);
				});

				blobStream.end(file.buffer);
			} catch (error) {
				Logging.error(NAME_SPACE, "FileStorage#upload", error);
			}
		});
	}

	/**
	 * Upload single file to clound storage
	 * @param request
	 * @param response
	 * @param next
	 */
	single(request: any, response: any, next: any): void {
		const file = request.file;
		Logging.info(NAME_SPACE, "FileStorage#single file", file);
		if (file) {
			this.upload(file)
				.then((image) => {
					request.body = image;
					next();
				})
				.catch((error) => {
					this.appResponse.badRequest(request, response, error);
				});
		} else {
			this.appResponse.notFound(request, response);
		}
	}
}

export default FileStorage;
