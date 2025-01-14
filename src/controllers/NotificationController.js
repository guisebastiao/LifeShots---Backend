import Notification from "../models/Notification";

class NotificationController {
  async index(req, res) {
    try {
      const { username } = req;
      const { offset = 1, limit = 10 } = req.query;

      const countNotifications = await Notification.count({
        where: {
          userId: username,
        },
      });

      const lastOffset = Math.ceil(countNotifications / Number(limit));

      const notifications = await Notification.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: {
          userId: username,
        },
        attributes: ["id", "recipientId", "senderId", "type", "isRead", "createdAt"],
      });

      const paging = {
        offset: Number(offset),
        prev: Number(offset) > 1 ? Number(offset) - 1 : null,
        next: Number(offset) >= lastOffset ? null : Number(offset) + 1,
        lastOffset,
      };

      return res.json({ paging, notifications });
    } catch (error) {
      console.error("Error in NotificationController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new NotificationController();