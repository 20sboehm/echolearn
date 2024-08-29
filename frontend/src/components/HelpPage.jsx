import { useState } from "react";
const topics = [
  "Hello",
  "World",
];

function HelpPage() {
  const [search, setSearch] = useState('');

  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full h-full">

      <div className="w-1/3 p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="mt-4">
          {filteredTopics.map((topic, index) => (
            <li key={index} className="p-2 border-b">
              {topic}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default HelpPage