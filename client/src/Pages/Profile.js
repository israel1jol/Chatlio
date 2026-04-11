import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = ({ addr }) => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(store => store.auth);
    const [picFile, setPicFile] = useState(null);
    const [picPreview, setPicPreview] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: ""
    });



    useEffect(() => {
        if (!localStorage.getItem("refToken")) nav("/login");
        else{
            setLoading(true);

            const getToken = async () => {
                try{
                    const res = await fetch(`${addr}/api/v1/auth/accessToken`, {
                        method:"GET",
                        headers:{
                            "authorization":"Bearer "+localStorage.getItem("refToken")
                        }
                    });
                    const data = await res.json();
                    if(data.error) {
                        dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Login session expired"}})
                        localStorage.removeItem("refToken"); 
                        return nav("/login");
                    }
                    getUser(data.accessToken);
                } catch(e){
                    dispatch({type:"active_session_with_error", error:{err:true, type:"general-error", message:"Can't connect to server"}})
                }   
            }

            const getUser = async (token) => {
                const res = await fetch(`${addr}/api/v1/auth/info`, {
                                    method:"POST",
                                    headers:{
                                        "content-type":"application/json"
                                    },
                                    body:JSON.stringify({
                                        token:token
                                    })
                            });
                const user = await res.json();
                if(user.error){
                    localStorage.removeItem("refToken");
                    dispatch({type:"cancelEm"})
                    return dispatch({type:"cancel_session_with_error", error:{err:true, type:"general-error", message:user.error}})
                }
                setForm({firstname:user.firstname, lastname:user.lastname, username:user.username, email:user.email})
            }
            getToken();
            setLoading(false);
        }
    }, [auth.authenticated, nav]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setStatus("");

        const token = auth.user.token;

        try {
            const res = await fetch(`${addr}/api/v1/auth/updateProfile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...form, token })
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error || "Update failed");
                return;
            }

            dispatch({ type: "active_session", payload: data });
            setStatus("Profile updated successfully");
        } catch (err) {
            setError("Could not update profile");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPicFile(file);
        setPicPreview(URL.createObjectURL(file));
        setStatus("");
        setError("");
    };

    const uploadProfilePic = async () => {
        if (!picFile) {
            setError("Select a photo first");
            return;
        }

        const token = auth.user.token;
        if (!token) {
            setError("Authentication required");
            return;
        }

        setUploading(true);
        setError("");
        setStatus("");

        const formData = new FormData();
        formData.append("pic", picFile);

        try {
            const res = await fetch(`${addr}/api/v1/auth/profilePic`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error || "Upload failed");
                return;
            }

            dispatch({ type: "active_session", payload: data.user || data });
            setStatus("Profile picture updated");
            setPicFile(null);
            setPicPreview("");
        } catch (err) {
            setError("Could not upload profile picture");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="profile-page">Loading profile...</div>;
    }

    return (
        <div className="profile-page">
            <div className="test-comp">
                <div className="profile-card">
                    <aside className="profile-sidebar">
                        <div className="profile-avatar">
                            {picPreview ? (
                                <img src={picPreview} alt="Preview" />
                            ) : auth.user.profileImage ? (
                                <img src={auth.user.profileImage} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder">No image</div>
                            )}
                        </div>

                        <div className="profile-sidebar-meta">
                            <h2>{auth.user.username}</h2>
                            <p>{auth.user.email}</p>
                        </div>

                        <div className="profile-photo-actions">
                            <label className="file-label">
                                {picFile ? "Change photo" : "Upload a photo"}
                                <input type="file" name="pic" accept="image/*" onChange={handleFileChange} />
                            </label>

                            {picFile && (
                                <button type="button" onClick={uploadProfilePic} disabled={uploading}>
                                    {uploading ? "Uploading..." : "Save photo"}
                                </button>
                            )}
                        </div>
                    </aside>

                    <main className="profile-main">
                        {error && <div className="profile-message error">{error}</div>}
                        {status && <div className="profile-message success">{status}</div>}

                        <h3>Edit profile</h3>
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <label className="form-group">
                                <span>First name</span>
                                <input name="firstname" value={form.firstname} onChange={handleChange} required />
                            </label>
                            <label className="form-group">
                                <span>Last name</span>
                                <input name="lastname" value={form.lastname} onChange={handleChange} required />
                            </label>
                            <label className="form-group">
                                <span>Username</span>
                                <input name="username" value={form.username} onChange={handleChange} required />
                            </label>
                            <label className="form-group">
                                <span>Email</span>
                                <input name="email" type="email" value={form.email} onChange={handleChange} required />
                            </label>

                            <div className="profile-actions">
                                <button type="submit" className="submit-btn">
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;