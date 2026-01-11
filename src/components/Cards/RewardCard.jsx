import "./cards.css";
import Button from "../UI/Button";

export default function RewardCard({
  image,
  title,
  pointsRequired,
  userPoints,
  status, // "available" | "locked" | "redeemed"
  onRedeem,
}) {
  const isLocked = userPoints < pointsRequired;
  const isRedeemed = status === "redeemed";

  return (
    <div 
      className={`reward-card ${
        isLocked ? "reward-locked" : isRedeemed ? "reward-redeemed" : ""
      }`}
    >
      <div className="reward-image-container">
        <img src={image} alt={title} className="reward-image" />
      </div>

      <div className="reward-content">
        <h4 className="reward-title">{title}</h4>

        <p className="reward-points">
          🎁 {pointsRequired} Points Required
        </p>

        {isRedeemed && (
          <span className="reward-status success">✔ Already Redeemed</span>
        )}

        {isLocked && !isRedeemed && (
          <span className="reward-status warning">
            ⛔ Need {pointsRequired - userPoints} more points
          </span>
        )}

        {!isLocked && !isRedeemed && (
          <Button 
            text="Redeem Reward" 
            variant="primary" 
            onClick={onRedeem} 
          />
        )}
      </div>
    </div>
  );
}
