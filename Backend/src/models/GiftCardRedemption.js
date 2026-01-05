module.exports = (sequelize, DataTypes) => {
  const GiftCardRedemption = sequelize.define('GiftCardRedemption', {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    gift_card_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'gift_cards', key: 'id' } },
    wallet_ledger_id: { type: DataTypes.CHAR(36), allowNull: false, references: { model: 'customer_wallet_ledger', key: 'id' } },
    booking_id: { type: DataTypes.CHAR(36), allowNull: true, references: { model: 'bookings', key: 'id' } },
    membership_cycle_id: { type: DataTypes.CHAR(36), allowNull: true },
    amount_used: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    redeemed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    created_by: { type: DataTypes.CHAR(36), allowNull: true },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'gift_card_redemptions', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  return GiftCardRedemption;
};



