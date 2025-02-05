/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Modal = ({ show, onClose, children }) => {
      if (!show) return null;
      return (
            <div className="modal show d-block" tabIndex="-1">
                  <div className="modal-dialog">
                        <div className="modal-content">
                              <div className="modal-header">
                                    <button onClick={onClose} className="btn-close" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">{children}</div>
                        </div>
                  </div>
            </div>
      );
};

export default function AuthModal() {
      const [isLoginOpen, setLoginOpen] = useState(false);
      const [isSignupOpen, setSignupOpen] = useState(false);
      const navigate = useNavigate();

      const handleLogin = async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = {
                  username: formData.get("username"),
                  password: formData.get("password"),
            };

            try {
                  const response = await fetch("http://localhost:8080/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                        credentials: "include",
                  });

                  if (response.ok) {
                        const result = await response.json();
                        localStorage.setItem("authToken", result.token); // Store token
                        navigate("/talk"); // Redirect using React Router
                  } else {
                        alert("Login failed. Please check your credentials.");
                  }
            } catch (error) {
                  console.error("Login error:", error);
                  alert("Something went wrong. Try again later.");
            }
      };

      const handleSignup = async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);

            try {
                  const response = await fetch("http://localhost:8080/signup", {
                        method: "POST",
                        body: formData, // Handles file upload
                  });

                  if (response.ok) {
                        alert("Account created! Redirecting to the posts page.");
                        setSignupOpen(false);
                        navigate("/talk"); // Redirect to /talk after successful signup
                  } else {
                        alert("Signup failed. Try again.");
                  }
            } catch (error) {
                  console.error("Signup error:", error);
                  alert("Something went wrong. Try again later.");
            }
      };

      return (
            <div className="container text-center mt-5">
                  <h2 className="mb-4">Modal Login Form</h2>
                  <button onClick={() => setLoginOpen(true)} className="btn btn-primary">
                        Login
                  </button>

                  {/* Login Modal */}
                  <Modal show={isLoginOpen} onClose={() => setLoginOpen(false)}>
                        <form onSubmit={handleLogin}>
                              <h3>Login</h3>
                              <div className="mb-3">
                                    <input type="text" name="username" placeholder="Enter Username" required className="form-control" />
                              </div>
                              <div className="mb-3">
                                    <input type="password" name="password" placeholder="Enter Password" required className="form-control" />
                              </div>
                              <button className="btn btn-primary w-100" type="submit">Login</button>
                              <div className="form-check mt-2">
                                    <input type="checkbox" className="form-check-input" name="remember" />
                                    <label className="form-check-label">Remember me</label>
                              </div>
                              <div className="d-flex justify-content-between mt-2">
                                    <a href="#" className="text-primary">Forgot password?</a>
                                    <button onClick={() => { setLoginOpen(false); setSignupOpen(true); }} className="btn btn-link">
                                          Create an account
                                    </button>
                              </div>
                        </form>
                  </Modal>

                  {/* Signup Modal */}
                  <Modal show={isSignupOpen} onClose={() => setSignupOpen(false)}>
                        <form onSubmit={handleSignup}>
                              <h3>Sign Up</h3>
                              <div className="mb-3">
                                    <input type="email" name="email" placeholder="Enter Email" required className="form-control" />
                              </div>
                              <div className="mb-3">
                                    <input type="text" name="username" placeholder="Enter Username" required className="form-control" />
                              </div>
                              <div className="mb-3">
                                    <input type="file" name="profile" required className="form-control" />
                              </div>
                              <div className="mb-3">
                                    <input type="password" name="password" placeholder="Enter Password" required className="form-control" />
                              </div>
                              <button className="btn btn-success w-100" type="submit">Create Account</button>
                        </form>
                  </Modal>
            </div>
      );
}
