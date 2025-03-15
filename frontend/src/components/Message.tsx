import {ReactElement, RefObject} from "react";
import {ContactType} from "../interface/contactType";
import {MessageType} from "../interface/messageType";

interface Props {
	msg: MessageType;
	selectedContact: ContactType;
	index: number;
	chatMessages: MessageType[];
	lastMessageRef: RefObject<HTMLDivElement | null>;
}

export default function Message(
 {
	 msg,
	 selectedContact,
	 index,
	 chatMessages,
	 lastMessageRef,
 }: Props): ReactElement {
	const isSent = msg.receiver_id === selectedContact?.id;

	return (
	 <div
		ref={index === chatMessages.length - 1 ? lastMessageRef : null}
		key={msg.id}
		className={`flex w-full ${isSent ? "justify-end" : "justify-start"} mb-2`}
	 >
		 <div
			className={`relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md ${
			 isSent
				? "bg-purple-500 text-white rounded-br-none"
				: "bg-gray-200 text-gray-900 rounded-bl-none"
			}`}
		 >
			 <p className="text-sm">{msg.content}</p>
		 </div>
	 </div>
	);
}
