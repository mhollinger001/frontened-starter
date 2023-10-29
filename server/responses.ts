import { LessonDoc } from "concepts/lesson";
import { Exercise, Question, User, Video } from "./app";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FriendRequestDoc, FriendRequestNotFoundError } from "./concepts/friend";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { Router } from "./framework/router";
import { ExerciseDoc } from "concepts/exercise";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await User.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Convert LessonDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async lesson(lesson: LessonDoc | null) {
    if (!lesson) {
      return lesson;
    }
    const author = await User.getUserById(lesson.author);
    const subLessons: any[] = [];
    for (const {subLessonId, index} of lesson.subLessons.map((subLessonId, index) => ({ subLessonId, index}))) {
      if (lesson.subLessonTypes[index] === 'exercise') {
        subLessons.push(await Responses.exercise(await Exercise.getExerciseById(subLessonId)));
      } else if (lesson.subLessonTypes[index] === 'video') {
        subLessons.push(await Video.getVideoById(subLessonId));
      }
    }
    return { ...lesson, author: author.username, subLessons };
  }

  /**
   * Same as {@link lesson} but for an array of PostDoc for improved performance.
   */
  static async lessons(lessons: LessonDoc[]) {
    const authors = await User.idsToUsernames(lessons.map((lesson) => lesson.author));
    const formattedLessons = [];

    for (const {lesson, i} of lessons.map((lesson, i) => ({lesson, i}))) {
      const subLessons: any[] = [];
      for (const {subLessonId, index} of lesson.subLessons.map((subLessonId, index) => ({ subLessonId, index}))) {
        if (lesson.subLessonTypes[index] === 'exercise') {
          subLessons.push(Responses.exercise(await Exercise.getExerciseById(subLessonId)));
        } else if (lesson.subLessonTypes[index] === 'video') {
          subLessons.push(await Video.getVideoById(subLessonId));
        }
      }
      formattedLessons.push({...lesson, author: authors[i], subLessons})
    }
    return formattedLessons;
  }

  /**
   * Convert ExerciseDoc into more readable format for the frontend by converting the questionIds into QuestionDocs.
   */
  static async exercise(exercise: ExerciseDoc) {
    const questions = [];
    for (const questionId of exercise.questions) {
      const question = await Question.getQuestionById(questionId);
      questions.push(question);
    }
    return { ...exercise, questions };
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: FriendRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await User.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
