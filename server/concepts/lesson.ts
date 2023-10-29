import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface LessonDoc extends BaseDoc {
    author: ObjectId;
    title: string;
    subLessons: ObjectId[];
    subLessonTypes: string[];
}

export interface subLesson {
    type: string;
    title: string;
    questions?: question[];
    videoUrl?: string;
}
  
export interface question {
    question: string;
    answerType: string;
    answer: string;
}

export default class LessonConcept {
    public readonly lessons = new DocCollection<LessonDoc>("lessons");

    async create(author: ObjectId, title: string, subLessons: ObjectId[], subLessonTypes: string[]) {
        const _id = await this.lessons.createOne({ author, title, subLessons, subLessonTypes });
        return { msg: "Lesson Created!", lesson: await this.lessons.readOne({ _id }) };
    }

    async getLessons(query: Filter<LessonDoc>) {
        const posts = await this.lessons.readMany(query, {
          sort: { dateUpdated: -1 },
        });
        return posts;
    }

    async getLessonById(_id: ObjectId) {
        const lesson = await this.lessons.readOne({ _id });
        if (lesson === null) {
            throw new NotFoundError(`Lesson Not Found!`);
        }
        return lesson;
    }

    async getByAuthor(author: ObjectId) {
        return await this.getLessons({ author });
    }

    async addSubLessons(_id: ObjectId, newSubLessons: ObjectId[], newSubLessonTypes: string[], location: number = -1) {
        const lesson = await this.getLessonById(_id);
        const subLessons = lesson.subLessons;
        const subLessonTypes = lesson.subLessonTypes;
        if (location === -1) location = subLessons.length;
        subLessons.splice(location, 0, ...newSubLessons);
        subLessonTypes.splice(location, 0, ...newSubLessonTypes);
        return this.update(_id, { subLessons, subLessonTypes });
    }

    async removeSubLessons(_id: ObjectId, subLessonsToRemove: Set<ObjectId>) {
        const lesson = await this.getLessonById(_id);
        const indexes = new Set<number>;
        const subLessons = lesson.subLessons.filter((value, index) => {
            if (!subLessonsToRemove.has(value)) {
                return true;
            }
            indexes.add(index);
            return false;
        });
        const subLessonTypes = lesson.subLessonTypes.filter((_, index) => !indexes.has(index));
        return this.update(_id, { subLessons, subLessonTypes });
    }

    async removeSubLesson(_id: ObjectId, index: number) {
        const lesson = await this.getLessonById(_id);
        const subLessons = lesson.subLessons;
        subLessons.splice(index, 1);
        const subLessonTypes = lesson.subLessonTypes;
        subLessonTypes.splice(index, 1);
        return this.update(_id, { subLessons, subLessonTypes })
    }

    async isAuthor(author: ObjectId, _id: ObjectId) {
        const lesson = await this.getLessonById(_id);
        if (lesson.author.toString() !== author.toString()) {
            throw new NotAllowedError(`Unauthorized Change`);
        }
    }

    async update(_id: ObjectId, update: Partial<LessonDoc>) {
        await this.lessons.updateOne({ _id }, update);
        return { msg: "Lesson Updated!" };
    }

    async delete(_id: ObjectId) {
        await this.lessons.deleteOne({ _id });
        return { msg: "Lesson Deleted!" };
    }
}