import {ReactElement, useEffect, useRef, useState, UIEvent} from "react";
import {MessageType} from "../interface/messageType";
import {ContactType} from "../interface/contactType";
import {useAuthStore} from "../store/auth";
import Message from "./Message";

interface Props {
	isLoading: boolean;
	selectedContact: ContactType;
	messages: MessageType[];
	fetchNextPage: () => void;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
}

export default function Chat(
 {
	 isLoading,
	 selectedContact,
	 messages,
	 fetchNextPage,
	 hasNextPage,
	 isFetchingNextPage,
 }: Props): ReactElement {
	const {sendMessage} = useAuthStore();
	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	const messageRef = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState("");
	const [chatMessages, setChatMessages] = useState(messages);

	useEffect(() => {
		setChatMessages(messages);
	}, [messages]);

	const handleSendMessage = async () => {
		if (!message.trim()) return;

		try {
			const response = await sendMessage(selectedContact?.id, message);

			if (response) {
				setChatMessages((prevMessages) => [...prevMessages, response]);
				setMessage("");
			}
		} catch (error) {
			console.error("Error al enviar el mensaje:", error);
		}
	};

	const handleScroll = (event: UIEvent<HTMLDivElement>) => {
		const {scrollTop} = event.currentTarget;
		if (scrollTop < 10 && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	return (
	 <div className="flex-1 flex flex-col">
		 {selectedContact.id !== "" ? (
			<>
				<div className="p-4 border-b bg-gray-300">
					<h2 className="text-xl font-bold">{selectedContact?.name}</h2>
				</div>

				{/* Loading mensajes anteriores */}
				{isFetchingNextPage && (
				 <div className="text-center text-gray-500">Cargando más mensajes...</div>
				)}

				{/* Chat box */}
				<div
				 className="flex flex-col-reverse gap-y-0.1 p-2 overflow-auto h-screen"
				 onScroll={handleScroll}
				>
					{[...messages].reverse().map((msg: MessageType, index: number) => (
					 <Message msg={msg} selectedContact={selectedContact} index={index} chatMessages={chatMessages}
										lastMessageRef={lastMessageRef}/>
					))}
				</div>
				{/* Chat box */}

				{/* Input para enviar mensaje */}
				<div className="p-4 border-t bg-white flex flex-wrap gap-2">
					<input
					 type="text"
					 ref={messageRef}
					 placeholder="Escribe un mensaje..."
					 className="flex-1 p-2 border rounded-md"
					 value={message}
					 disabled={isLoading}
					 onChange={(e) => setMessage(e.target.value)}
					 onKeyDown={(e) => {
						 if (e.key === "Enter") {
							 e.preventDefault();
							 handleSendMessage();
						 }
					 }}
					/>
					<button
					 onClick={handleSendMessage}
					 className="px-4 py-2 bg-purple-500 text-white rounded-md"
					 aria-label="Enviar mensaje"
					 disabled={isLoading}
					>
						Enviar
					</button>
				</div>
			</>
		 ) : (
			<div className="flex items-center justify-center flex-1">
				<p className="text-gray-500">Selecciona un contacto para chatear</p>
			</div>
		 )}
	 </div>
	);
}
