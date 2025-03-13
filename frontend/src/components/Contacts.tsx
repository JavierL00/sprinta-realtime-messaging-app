import {ReactElement} from "react";
import {Contact} from "../interface/contact";
import {useAuthStore} from "../store/auth";

interface Props {
	handleSelectContact: (contact: Contact) => void;
	selectedContact: Contact;
}

export default function Contacts({handleSelectContact, selectedContact}: Props): ReactElement {
	const {user, contacts} = useAuthStore();

	return (
	 <div className="w-1/4 min-w-[150px] border-r bg-gray-100 p-4 flex-shrink-0">
		 <h2 className="text-xl font-bold pb-2 pl-1.5">Bienvenido, {user?.name}!</h2>
		 <input
			type="text"
			placeholder="Buscar..."
			className="w-full mt-2 p-2 border rounded-md"
		 />
		 <ul className="mt-4 space-y-2">
			 {contacts.map((contact: Contact) => (
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