type ThreadCategory = "THREAD" | "QNA";

type User = {
	userName: string;
	password: string
}

type Thread = {
  id: number;
	title: string;
	category: ThreadCategory;
	creationDate: string;
	description: string;
	creator: User;
	commentCount: number;
	locked: boolean;
}

type QNAThread =  Thread & { //Type extension
	category: "QNA";
	isAnswered: boolean;
	commentAnswerId?: number;
}

type ThreadComment = {
	id: number;
	thread: number;
	content: string;
	creator: User
	creationDate: string;
	isAnswer?: boolean;
}