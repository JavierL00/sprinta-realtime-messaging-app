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
	const limit: number = 20;

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["messages", selectedContact.id],
		queryFn: async ({ pageParam = 1 }) => {
			return await fetchMessages(selectedContact.id, pageParam, limit);
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < limit) return undefined;
			return allPages.length + 1;
		},
		staleTime: 1000 * 60 * 5,
		retry: 3,
	});

	const messages = data?.pages.flat() || [];

	const handleSelectContact = useCallback(async (contact: Contact) => {
		setSelectedContact(contact);
	}, []);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	if (loading || isLoading) {
		return <Loading/>;
	}

	return (
	 <div className="border h-svh p-8">
		 <div className="border w-full h-full">
			 <div className="flex h-full overflow-hidden">
				 <Contacts handleSelectContact={handleSelectContact} selectedContact={selectedContact}/>
				 <Chat
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
