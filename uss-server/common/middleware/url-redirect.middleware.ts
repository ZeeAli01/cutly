import { Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { url } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UrlRedirectMiddleware implements NestMiddleware {
    constructor(private readonly databaseService: DatabaseService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        console.log('------');
        console.log("REQUEST OBJECT = ", req, "\nresponse OBJECT = ", "\n------------");
        console.log('url redirect middleware...');
        console.log("request.params:", req.params);
        const short_url: string = req.params.url;
        let original: url | undefined;
        try {
            original = await this.databaseService.url.findUnique({ where: { short_url } });
            if (!original) {
                throw new InternalServerErrorException('URL NOT FOUND ON SERVER');
            }
        } catch (error) {
            console.error(error);
        }
        const currentDate: Date = new Date();
        let notExpired: boolean = true;
        if (original.expiration_date) {
            notExpired = currentDate < new Date(original.expiration_date);
        }

        if (original &&
            notExpired &&
            !original.is_deleted && original.status !== 'inactive') {
            // save the info of this url click
            res.redirect(302, original.original_url);
        }
        else {
            next();
        }
        console.log('------');

    }
}
