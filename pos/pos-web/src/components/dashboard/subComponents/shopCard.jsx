import { SHOP_ROLE } from "@pos/shared-models";
import "./shopCard.css"; // Create this CSS file

const ShopCard = ({ logo, name, shopRole, onClick, isSelected = false }) => {
  return (
    <div className={`shop-card ${isSelected ? "shop-card--selected" : ""}`} onClick={onClick}>
      <div className="shop-card__tab"></div>

      <div className="shop-card__content">
        <div className="shop-card__header">
          <div className="shop-card__logo">
            {logo ? (
              <img src={logo} alt={`${name} logo`} />
            ) : (
              <span className="shop-card__logo-placeholder">🏬</span>
            )}
          </div>
          <div className="shop-card__info">
            <h3 className="shop-card__name">{name}</h3>
            <p className="shop-card__type">Shop</p>
          </div>
        </div>

        <div className="shop-card__manager">
          <p className="shop-card__manager-label">{SHOP_ROLE.KEYS[shopRole].text}</p>
          {/* <p className="shop-card__manager-name">{manager}</p> */}
        </div>
      </div>
    </div>
  );
};
export default ShopCard;
