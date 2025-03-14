import {ReactElement, useEffect, useRef, useState, UIEvent, useLayoutEffect} from "react";
import {Message} from "../interface/message";
import {Contact} from "../interface/contact";
import {useAuthStore} from "../store/auth";

interface Props {
	isLoading: boolean;
	selectedContact: Contact;
	messages: Message[];
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
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [message, setMessage] = useState("");

	const handleSendMessage = async () => {
		if (!message.trim()) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			content: message,
			sender_id: useAuthStore.getState().user?.id,
			receiver_id: selectedContact?.id,
			created_at: new Date().toISOString(),
		};

		messages.push(newMessage);

		await sendMessage(selectedContact?.id, message);

		setMessage("");
	};

	const handleScroll = (event: UIEvent<HTMLDivElement>) => {
		const {scrollTop} = event.currentTarget;
		if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	useLayoutEffect(() => {
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({behavior: "smooth"});
		}
	}, [messages]);

	return (
	 <div className="flex-1 flex flex-col">
		 {selectedContact.id !== "" ? (
			<>
				<div className="p-4 border-b bg-gray-300">
					<h2 className="text-xl font-bold">{selectedContact?.name}</h2>
				</div>

				{/* Chat box */}
				<div
				 ref={chatContainerRef}
				 className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[50vh]"
				 onScroll={handleScroll}
				>
					{/* Loading mensajes anteriores */}
					{isFetchingNextPage && (
					 <div className="text-center text-gray-500">Cargando más mensajes...</div>
					)}

					{messages.map((msg: Message, index: number) => (
					 <div
						ref={index === messages.length - 1 ? lastMessageRef : null}
						key={msg.id}
						className={`flex w-full ${msg.receiver_id === selectedContact?.id ? "justify-end" : "justify-start"}`}
					 >
						 <div
							className={`p-3 rounded-lg w-fit ${
							 msg.receiver_id === selectedContact?.id ? "bg-gray-300" : "bg-purple-500 text-white"
							}`}
						 >
							 {msg.content}
						 </div>
					 </div>
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
