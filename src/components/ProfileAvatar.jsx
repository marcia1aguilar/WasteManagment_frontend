import "../styles/ProfileAvatar.css";

export default function ProfileAvatar({ imageUrl, altText }) {
    return (
        <div className="profile-avatar">
            <div className="avatar-circle">
                <div className="avatar-circle">
                    <img src="/assets/images/operator.jpg" alt="Operator" />
                </div>
            </div>
            <p>Operator Name</p>
        </div>
    );
}