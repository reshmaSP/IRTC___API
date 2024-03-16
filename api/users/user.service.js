const pool = require("../../config/database");

function generateBookId() {
  const timestamp = new Date().getTime();
  const uniqueID = `train_${timestamp}_$}`;
  return uniqueID;
}
function seatNumbers(firstSeat ,range){
  const res=[];
  for(let i=0;i<range;i++)
  {
    res.push(firstSeat+i);
  }
  return res;
}

module.exports = {
  create: (data,uuid, callBack) => {
    pool.query(
      `insert into registration(uuid,userName, email, password) 
                values(?,?,?,?)`,
      [
        uuid,
        data.username,
        data.email,
        data.password,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserName: (userName, callBack) => {
    pool.query(
      `select * from registration where userName = ?`,
      [userName],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },





  addTrain:(body,train_id,callBack)=>{
    pool.query(
    `insert into train(train_id,train_name, source, destination,seat_capacity,arrival_time_at_source,arrival_time_at_destination ) 
                values(?,?,?,?,?,?,?)`,
      [
          train_id,
          body.train_name,
          body.source,
          body.destination,
          body.seat_capacity,
          body.arrival_time_at_source ,
          body.arrival_time_at_destination 
      ],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getTrain: (src, des, callBack) => {
    pool.query(
      `SELECT train_id, train_name, seat_capacity FROM train WHERE source = ? AND destination = ?`,
      [src, des],
      (error, results) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  bookTrainById:(id,req,callBack)=>{


    pool.query(`select * from train where train_id = ?}`,
    [id],(error,results)=>{
      if (error) {
        return callBack(error);
    }
    if (results.length == 0) {
      res.status(404).json('No data found')
   }
            const train = results[0]
            const book_id = generateaccount()

            if (train.available_seats >= req.body.no_of_seats) {
                const seats = seatNumbers(train.available_seats, req.body.no_of_seats)

                console.log(seats.toString())

                const bookData = {
                    booking_id: book_id,
                    train_id: train.train_id,
                    train_name: train.train_name,
                    user_id: req.body.user_id,
                    no_of_seats: req.body.no_of_seats,
                    seat_numbers:  seats,
                    arrival_time_at_source: train.arrival_time_at_source,
                    arrival_time_at_destination: train.arrival_time_at_destination
                }

                console.log(bookData)

                query = `INSERT INTO bookingTable SET ?`;
                var available_seats = train.available_seats - req.body.no_of_seats

                pool.query(query, bookData, async (error, result) => {
                    if (error) throw error;

                    query = `UPDATE ${train_table} SET available_seats = ${available_seats} where train_id = ${train.train_id}`

                    db.query(query, async (error, results) => {
                        if (error) throw error;
                        
                        res.status(200).json({
                            "message": "Seat booked successfully",
                            "booking_id": result.booking_id,
                            "seat_numbers": seats
                        })
                    })
                });
                return callBack(null, results);


            } else {
                return callBack(error);

            }
  }
    )
}
};
