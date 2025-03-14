import {useCallback, useEffect, useState} from "react";
import {useAuthStore} from "../store/auth";
import Loading from "./Loading";
import {Contact} from "../interface/contact";
import {defaultContact} from "../data/contacts";
import Contacts from "./Contacts";
import Chat from "./Chat";
import {useInfiniteQuery} from "@tanstack/react-query";

export default function Inbox() {
	const [selectedContact, setSelectedContact] = useState<Contact>(defaultContact);
	const {loading, fetchMessages, fetchContacts} = useAuthStore();
	const limit: number = 30;

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["messages", selectedContact.id],
		queryFn: async ({pageParam = 1}) => {
			const messages = await fetchMessages(selectedContact.id, pageParam, limit);
			return messages.reverse();
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < limit) return undefined;
			return allPages.length + 1;
		},
		staleTime: 1000 * 60 * 5,
		retry: 3,
	});

	const messages = data?.pages.flat().reverse() || [];

	const handleSelectContact = useCallback(async (contact: Contact) => {
		setSelectedContact(contact);
	}, []);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	if (loading) {
		return <Loading/>;
	}

	return (
	 <div
		className="h-svh p-8"
		style={{
			backgroundImage: `radial-gradient(#9b4fad 2px, transparent 1px), radial-gradient(#9b4fad 1px, transparent 1px)`,
			backgroundSize: `32px 32px`,
			backgroundPosition: `0 0, 16px 16px`,
			backgroundColor: `#f9f9f9`,
		}}
	 >
		 <div className="border-4 bg-white w-full h-full overflow-hidden rounded-xl">
			 <div className="flex h-full overflow-hidden">
				 <Contacts handleSelectContact={handleSelectContact} selectedContact={selectedContact}/>
				 <Chat
					isLoading={isLoading}
					selectedContact={selectedContact}
					messages={messages}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				 />
			 </div>
		 </div>
	 </div>
	);
}
