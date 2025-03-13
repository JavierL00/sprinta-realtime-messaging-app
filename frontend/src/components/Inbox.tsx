import {useState} from "react";
import Contacts from "./Contacts";
import Chat from "./Chat";
import {useAuthStore} from "../store/auth";
import Loading from "./Loading";

export default function Inbox() {
	const [selectedContact, setSelectedContact] = useState<string | null>(null);

	const {loading} = useAuthStore();

	if (loading) {
		return <Loading/>;
	}

	return (
	 <div className="border h-svh p-8">
		 <div className="border w-full h-full">
			 <div className="flex h-full overflow-hidden">
				 <Contacts onSelectContact={setSelectedContact} selectedContact={selectedContact}/>
				 {selectedContact && <Chat contactId={selectedContact}/>}
			 </div>
		 </div>
	 </div>
	);
}
