export interface IServerHealth {
	status: string;
	timestamp: Date;
	models_loaded: ModelsLoaded;
	imports_working: ImportsWorking;
	directories_exist: DirectoriesExist;
	database_accessible: boolean;
}

export interface DirectoriesExist {
	image_dir: boolean;
	upload_dir: boolean;
}

export interface ImportsWorking {
	tensorflow: boolean;
	numpy: boolean;
	pil: boolean;
	psycopg2: boolean;
}

export interface ModelsLoaded {
	embedding_model: boolean;
	classification_model: boolean;
}
