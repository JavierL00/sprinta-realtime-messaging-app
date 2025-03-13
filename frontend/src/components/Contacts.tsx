import {ReactElement} from "react";
import {useAuthStore} from "../store/auth";

interface Props {
	selectedContact: string | null;
	setSelectedContact: (contact: string) => void;
}

export default function Contacts({selectedContact, setSelectedContact}: Props): ReactElement {
	const {user, contacts} = useAuthStore();

	return (
	 <div className="w-1/4 min-w-[250px] border-r bg-gray-100 p-4">
		 <h2 className="text-xl font-bold">Bienvenido, {user.name}!</h2>
		 <h2 className="text-xl font-bold">Contactos</h2>
		 <input
			type="text"
			placeholder="Buscar..."
			className="w-full mt-2 p-2 border rounded-md"
		 />
		 <ul className="mt-4 space-y-2">
			 {contacts?.map((contact) => (
				<li
				 key={contact.id}
				 onClick={() => setSelectedContact(contact.name)}
				 className={`p-3 rounded-lg cursor-pointer ${
					selectedContact === contact.name
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