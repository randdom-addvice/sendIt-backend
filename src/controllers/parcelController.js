import { validationResult } from "express-validator";

//Get all parcels by a specific from db
export const getUserParcels = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }
  const userId = parseInt(req.params.userId, 10);
  if (req.decoded.id === userId) {
    client
      .query(`SELECT * FROM parcels WHERE user_id = ${userId}`)
      .then((parcels) => {
        if (!parcels.rows.length) {
          res.status(404).send({ msg: "You do not have any parcel order yet" });
        } else {
          res.status(200).json(parcels.rows);
        }
      });
  } else {
    res
      .status(401)
      .json({ msg: "Unauthorized, you cannot view other users orders!" });
  }
};

//Get all parcels with admin priviledge
export const getAllParcels = (req, res) => {
  if (req.decoded.role !== "admin") {
    res.send({
      msg: "Unauthorized, you do not have permission to do this",
    });
  } else {
    client
      .query("SELECT * FROM parcels")
      .then((parcels) => res.json(parcels))
      .catch((err) => console.log(err.message));
  }
};

//Create parcel logic
export const createParcel = (req, res) => {
  const {
    user_id,
    pickup_location,
    destination,
    recipient_name,
    recipient_phone_no,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
    client
      .query(
        "INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone_no) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          user_id,
          pickup_location,
          destination,
          recipient_name,
          recipient_phone_no,
        ]
      )
      .then((parcel) => {
        res.json({
          success: true,
          msg: "Parcel created!",
          id: parcel.rows[0].id,
          parcel: parcel.rows[0],
        });
      })
      .catch((err) => {
        console.log(err);
        res.json(err.message);
      });
  } else {
    res.status(401).send({
      msg: "Unauthorized. You cannot create parcel for another user!",
    });
  }
};

//Change parcel destination
export const changeParcelDestination = (req, res) => {
  const { destination, user_id } = req.body;
  const { parcelId } = req.params;
  if (req.decoded.id === parseInt(user_id, 10)) {
    client
      .query(
        `UPDATE parcels SET destination = $2 WHERE id = $1 AND user_id = $3 RETURNING *`,
        [parcelId, destination, user_id]
      )
      .then((updatedParcel) => {
        if (!updatedParcel.rows[0]) {
          res.json({ msg: "Unauthorized, you are not allowed to do that" });
        } else {
          res.json({
            success: true,
            msg: "Destination changed successfully",
            changes: updatedParcel.rows[0],
          });
        }
      })
      .catch((err) => res.json({ msg: err.message }));
  } else {
    res.json({ msg: "Unauthorized, you are not allowed to do that" });
  }
};

//Change status of a parcel delivery order
export const changeStatus = (req, res) => {
  const { status } = req.body;
  const { parcelId } = req.params;
  if (req.decoded.role !== "admin") {
    res.json({ msg: "Unauthorized, you are not allowed to do that" });
  } else {
    client
      .query("UPDATE Parcels SET status = $1 WHERE id = $2 RETURNING *", [
        status,
        parcelId,
      ])
      .then((updatedParcel) => {
        res.json({
          msg: "status changed successfully",
          changes: updatedParcel.rows[0],
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};

//change the present location of a parcel delivery order
export const changeLocation = (req, res) => {
  const { location } = req.body;
  const { parcelId } = req.params;
  if (req.decoded.role !== "admin") {
    res.json({ msg: "Unauthorized, you are not allow to do that" });
  } else {
    client
      .query(
        `UPDATE parcels SET pickup_location = $1 WHERE id = $2 RETURNING *`,
        [location, parcelId]
      )
      .then((updatedLocation) => {
        res.json({
          msg: "status changed successfully",
          changes: updatedLocation.rows[0],
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};

//cancel a parcel delivery order
export const cancelParcel = (req, res) => {
  const { user_id } = req.body;
  const { parcelId } = req.params;
  if (req.decoded.id === parseInt(user_id, 10)) {
    client
      .query(
        `UPDATE parcels SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *`,
        [parcelId, user_id]
      )
      .then((data) => {
        res.json({
          success: true,
          msg: "parcel delivery cancelled successfully",
          details: data.rows[0],
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  } else {
    res.json({ msg: "Unauthorized, you are not allowed to do that" });
  }
};
