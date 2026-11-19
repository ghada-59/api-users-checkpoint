import { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function UserList() {
  // 1. Store the list of users
  const [listOfUsers, setListOfUsers] = useState([]);

  // 2. Store the loading state
  const [loading, setLoading] = useState(true);

  // 3. Store possible errors
  const [error, setError] = useState("");

  // 4. Store the search input
  const [searchTerm, setSearchTerm] = useState("");

  // 5. Store the ID of the selected user
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users when the component first renders
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL);

        // Store the received users
        setListOfUsers(response.data);
      } catch (err) {
        console.error("API Error:", err);

        setError("Unable to load users. Please try again.");
      } finally {
        // This runs whether the request succeeds or fails
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users according to the search input
  const filteredUsers = listOfUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display loading message
  if (loading) {
    return (
      <div className="state-screen">
        <div className="loader"></div>
        <h2>Loading users...</h2>
        <p>Please wait while we fetch the data.</p>
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className="state-screen">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Handle clicking on a user
  const handleUserClick = (userId) => {
    setSelectedUserId((currentId) =>
      currentId === userId ? null : userId
    );
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">REACT · AXIOS · REST API</p>

        <h1>Explore Users</h1>

        <p className="hero-description">
          Discover user profiles and explore their information.
        </p>

        <div className="user-count">
          <span className="count-number">{listOfUsers.length}</span>
          <span>Users available</span>
        </div>
      </header>

      <main className="main-content">
        <section className="toolbar">
          <div className="search-container">
            <label htmlFor="user-search">Search users</label>

            <input
              id="user-search"
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <p className="results-count">
            {filteredUsers.length} result(s)
          </p>
        </section>

        <section className="user-grid">
          {filteredUsers.length === 0 ? (
            <p className="empty-message">
              No users found. Try another name.
            </p>
          ) : (
            filteredUsers.map((user) => {
              const isExpanded = selectedUserId === user.id;

              return (
                <article className="user-card" key={user.id}>
                  <button
                    type="button"
                    className="user-card-header"
                    onClick={() => handleUserClick(user.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`user-details-${user.id}`}
                  >
                    <div className="user-avatar">
                      {user.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="user-summary">
                      <h2>{user.name}</h2>
                      <p>{user.email}</p>
                      <span>{user.company.name}</span>
                    </div>

                    <span className="expand-icon">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      className="user-details"
                      id={`user-details-${user.id}`}
                    >
                      <h3>Additional Information</h3>

                      <p>
                        <strong>Address:</strong>{" "}
                        {user.address.suite}, {user.address.street},{" "}
                        {user.address.city}, {user.address.zipcode}
                      </p>

                      <p>
                        <strong>Phone:</strong> {user.phone}
                      </p>

                      <p>
                        <strong>Website:</strong>{" "}
                        <a
                          href={`https://${user.website}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {user.website}
                        </a>
                      </p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </main>

      <footer className="footer">
        User data provided by JSONPlaceholder API
      </footer>
    </div>
  );
}

export default UserList;