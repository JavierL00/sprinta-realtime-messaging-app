import {ReactElement, useEffect} from "react";
import {useAuthStore} from "../store/auth";

interface Props {
	onSelectContact: (id: string) => void;
	selectedContact: string | null;
}

export default function Contacts({onSelectContact, selectedContact}: Props): ReactElement {
	const {user} = useAuthStore();
	const contacts = useAuthStore((state) => state.contacts);
	const fetchContacts = useAuthStore((state) => state.fetchContacts);

	useEffect(() => {
		if (contacts === null) {
			fetchContacts();
		}
	}, [contacts, fetchContacts]);


	return (
	 <div className="w-1/4 min-w-[150px] border-r bg-gray-100 p-4">
		 <h2 className="text-xl font-bold pb-2 pl-1.5">Bienvenido, {user.name}!</h2>
		 <input
			type="text"
			placeholder="Buscar..."
			className="w-full mt-2 p-2 border rounded-md"
		 />
		 <ul className="mt-4 space-y-2">
			 {contacts?.map((contact) => (
				<li
				 key={contact.id}
				 onClick={() => onSelectContact(contact.id)}
				 className={`p-3 rounded-lg cursor-pointer ${
					selectedContact === contact.id
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