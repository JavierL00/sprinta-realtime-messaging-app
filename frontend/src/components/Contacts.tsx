import {ReactElement, useEffect, useState} from "react";
import {useAuthStore} from "../store/auth";
import {Contact} from "../interface/contact";

interface Props {
	onSelectContact: (contact: Contact) => void;
	selectedContact: Contact | null;
}

export default function Contacts({onSelectContact, selectedContact}: Props): ReactElement {
	const {user, contacts, fetchMessages, fetchContacts} = useAuthStore();
	const [messages, setMessages] = useState<any[]>([]);

	useEffect(() => {
		if (contacts === null) {
			fetchContacts();
		}
	}, [contacts, fetchContacts]);

	const handleFetchMessages = async (contact: Contact) => {
		const newMessages = await fetchMessages(contact.id, 1, 10);
		setMessages(newMessages);
	}

	const handleSelectContact = async (contact: Contact) => {
		onSelectContact(contact);
		await handleFetchMessages(contact);
	}

	return (
	 <div className="w-1/4 min-w-[150px] border-r bg-gray-100 p-4">
		 <h2 className="text-xl font-bold pb-2 pl-1.5">Bienvenido, {user.name}!</h2>
		 <input
			type="text"
			placeholder="Buscar..."
			className="w-full mt-2 p-2 border rounded-md"
		 />
		 <ul className="mt-4 space-y-2">
			 {contacts?.map((contact: Contact) => (
				<li
				 key={contact.id}
				 onClick={() => handleSelectContact(contact)}
				 className={`p-3 rounded-lg cursor-pointer ${
					selectedContact?.id === contact.id
					 ? "bg-purple-500 text-white"
					 : "hover:bg-gray-200"
				 }`}
				>
					{contact.name}
				</li>
			 ))}
		 </ul>
	 </div>
	);
}