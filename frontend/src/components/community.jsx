import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import 'katex/dist/katex.min.css';
import { useApi } from "../hooks";
import arrowIconImg from "../assets/arrow_icon.png"

function CommunityPage() {
  const api = useApi();
  const [allPublicDecks, setAllPublicDecks] = useState({});

  const { data: Alldecks, isLoading, error, refetch } = useQuery({
    queryFn: () =>
      api._get(`/api/decks/AllPublicDecks`).then((response) => response.json()),
  });

  useEffect(() => {
    if (Alldecks && Array.isArray(Alldecks)) {
      const publicDecks = Alldecks.filter((deck) => deck.isPublic === true);
      setAllPublicDecks(publicDecks);
    }

  }, [Alldecks]);

  useEffect(() => {
    console.log("Decks in State After Update:", allPublicDecks);
  }, [allPublicDecks]);


  if (allPublicDecks) {
    return (

      <>
        <Sidebar />
        {allPublicDecks && allPublicDecks.length > 0 ? (
          <div className="h-[50vh] overflow-y-auto border-t border-gray-500">
            {allPublicDecks.map(deck => (
              <div className="grid grid-cols-2 gap-4 font-medium px-2" key={deck.deck_id}>
                <div className="border rounded-sm bg-white text-black mt-2 px-2 py-2 relative" style={{ minHeight: '100px' }}>
                  <p>The author of the deck is: {deck.owner_id}</p>
                  <p>The name of the deck is: {deck.name}</p>
                  <p>The description of the deck is: {deck.description}</p>
                  <Link to={`/decks/${deck.deck_id}`} className="absolute top-0 right-0">
                    <img src={arrowIconImg} alt="Edit Icon" className="h-6 w-8" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </>
    )
  }
}


export default CommunityPage