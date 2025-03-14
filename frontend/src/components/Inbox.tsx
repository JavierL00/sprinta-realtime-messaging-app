import {useCallback, useEffect, useState} from "react";
import {useAuthStore} from "../store/auth";
import Loading from "./Loading";
import {Contact} from "../interface/contact";
import {Message} from "../interface/message";
import {defaultContact} from "../data/contacts";
import Contacts from "./Contacts";
import Chat from "./Chat";

export default function Inbox() {
	const [selectedContact, setSelectedContact] = useState<Contact>(defaultContact);
	const [messages, setMessages] = useState<Message[]>([]);
	const {loading, fetchMessages, fetchContacts} = useAuthStore();

	const handleFetchMessages = useCallback(async (contact: Contact) => {
		const newMessages = await fetchMessages(contact.id, 1, 10);
		setMessages((prev) => [...prev, ...newMessages]);
	}, [fetchMessages]);

	const handleSelectContact = async (contact: Contact) => {
		setSelectedContact(contact);
		await handleFetchMessages(contact);
	}

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	if (loading) {
		return <Loading/>;
	}

	return (
	 <div className="border h-svh p-8">
		 <div className="border w-full h-full">
			 <div className="flex h-full overflow-hidden">
				 <Contacts handleSelectContact={handleSelectContact} selectedContact={selectedContact}/>
				 <Chat selectedContact={selectedContact} setMessages={setMessages} messages={messages}/>
			 </div>
		 </div>
	 </div>
	);
}
