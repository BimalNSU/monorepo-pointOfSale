import { SHOP_ROLE } from "@/constants/role";
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

  return (
    <div className="shop-card" onClick={onClick}>
      <div className="shop-card-tab"></div>

      <div className="shop-card-content">
        <div className="shop-card-header">
          <div className="shop-logo">
            {logo ? (
              <img src={logo} alt={`${name} logo`} />
            ) : (
              <span className="logo-placeholder">🏬</span>
            )}
          </div>
          <div className="shop-info">
            <h3>{name}</h3>
            <p className="shop-type">Shop</p>
          </div>
        </div>

        <div className="shop-manager">
          <p className="manager-label">{SHOP_ROLE.KEYS[shopRole].text}</p>
          {/* <p className="manager-name">{manager}</p> */}
        </div>
      </div>
    </div>
  );
};
export default ShopCard;
