"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_typegoose_1 = require("nestjs-typegoose");
const movie_model_1 = require("./movie.model");
const telegram_service_1 = require("../telegram/telegram.service");
let MovieService = class MovieService {
    constructor(MovieModel, telegramService) {
        this.MovieModel = MovieModel;
        this.telegramService = telegramService;
    }
    async getAll(searchTerm) {
        let options = {};
        if (searchTerm)
            options = {
                $or: [
                    {
                        title: new RegExp(searchTerm, 'i'),
                    },
                ],
            };
        return this.MovieModel.find(options)
            .select('-updatedAt -__v')
            .sort({
            createdAt: 'desc',
        })
            .populate('actors genres')
            .exec();
    }
    async bySlug(slug) {
        const doc = await this.MovieModel.findOne({ slug })
            .populate('actors genres')
            .exec();
        if (!doc)
            throw new common_1.NotFoundException('Movie not found');
        return doc;
    }
    async byActor(actorId) {
        const docs = await this.MovieModel.find({ actors: actorId }).exec();
        if (!docs)
            throw new common_1.NotFoundException('Movies not found');
        return docs;
    }
    async byGenres(genreIds) {
        const docs = await this.MovieModel.find({
            genres: { $in: genreIds },
        }).exec();
        if (!docs)
            throw new common_1.NotFoundException('Movies not found');
        return docs;
    }
    async getMostPopular() {
        return this.MovieModel.find({ countOpened: { $gt: 0 } })
            .sort({ countOpened: -1 })
            .populate('genres')
            .exec();
    }
    async updateCountOpened(slug) {
        const updateDoc = await this.MovieModel.findOneAndUpdate({ slug }, {
            $inc: { countOpened: 1 },
        }, {
            new: true,
        }).exec();
        if (!updateDoc)
            throw new common_1.NotFoundException('Movie not found');
        return updateDoc;
    }
    async updateRating(id, newRating) {
        return this.MovieModel.findByIdAndUpdate(id, {
            rating: newRating,
        }, {
            new: true,
        }).exec();
    }
    async byId(_id) {
        const doc = await this.MovieModel.findById(_id);
        if (!doc)
            throw new common_1.NotFoundException('Movie not found');
        return doc;
    }
    async create() {
        const defaultValue = {
            bigPoster: '',
            actors: [],
            genres: [],
            poster: '',
            title: '',
            videoUrl: '',
            slug: '',
        };
        const movie = await this.MovieModel.create(defaultValue);
        return movie._id;
    }
    async update(_id, dto) {
        if (!dto.isSendTelegram) {
            await this.sendNotification(dto);
            dto.isSendTelegram = true;
        }
        const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
            new: true,
        }).exec();
        if (!updateDoc)
            throw new common_1.NotFoundException('Movie not found');
        return updateDoc;
    }
    async delete(id) {
        const deleteDoc = this.MovieModel.findByIdAndDelete(id).exec();
        if (!deleteDoc)
            throw new common_1.NotFoundException('Movie not found');
        return deleteDoc;
    }
    async sendNotification(dto) {
        return true;
    }
};
MovieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_typegoose_1.InjectModel)(movie_model_1.MovieModel)),
    __metadata("design:paramtypes", [Object, telegram_service_1.TelegramService])
], MovieService);
exports.MovieService = MovieService;
//# sourceMappingURL=movie.service.js.map