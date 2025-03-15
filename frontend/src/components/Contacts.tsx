import {ReactElement} from "react";
import {ContactType} from "../interface/contactType";
import {useAuthStore} from "../store/auth";

interface Props {
	handleSelectContact: (contact: ContactType) => void;
	selectedContact: ContactType;
}

export default function Contacts({handleSelectContact, selectedContact}: Props): ReactElement {
	const {user, contacts, signOut} = useAuthStore();

	return (
	 <div className="w-1/4 min-w-[150px] border-r bg-gray-100 p-4 flex-shrink-0">
		 <div className={'flex justify-between items-center pb-2'}>
			 <button className={'bg-purple-500 text-white px-2 py-1 rounded-md'} onClick={signOut}>
				 Sign out
			 </button>
			 <h2 className="text-xl font-bold pl-1.5">Bienvenido, {user?.name}!</h2>
		 </div>
		 <input
			aria-label="Buscar contactos"
			type="text"
			placeholder="Buscar contacto"
			className="w-full mt-2 p-2 border-2 rounded-md border-black placeholder:text-black"
		 />
		 <ul className="mt-4 space-y-2">
			 {contacts.map((contact: ContactType) => (
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