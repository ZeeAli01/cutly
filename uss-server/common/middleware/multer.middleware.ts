import { Injectable, NestMiddleware } from '@nestjs/common';
import multer, { StorageEngine } from 'multer';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MulterMiddleware implements NestMiddleware {
    private readonly upload: multer.Multer;

    constructor() {
        const storage: StorageEngine = multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb) => {
                cb(null, "../public/temp");
            },
            filename: (req: Request, file: Express.Multer.File, cb) => {
                cb(null, file.originalname);
            },
        });

        this.upload = multer({ storage });
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this.upload.single('file')(req, res, (err) => {
            if (err) {
                // Handle any errors here
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    }
}
