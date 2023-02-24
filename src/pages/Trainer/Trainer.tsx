import { useLocation } from "react-router-dom";
import {
  useAppContext,
  SignModal,
  BsFillTelephoneFill,
  AiFillFacebook,
  AiFillInstagram,
  SlSocialTwitter,
  db,
} from "../../common/utilities/utils";
import { useState } from "react";
import done from "../../../public/done.svg";
import "./Trainer.scss";
import { arrayUnion, doc, setDoc, Timestamp } from "firebase/firestore";
import { v4 } from "uuid";
import { toast } from "react-hot-toast";

const Trainer = () => {
  const Routerlocation = useLocation();
  const { user, userData } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [contacted, setContacted] = useState(false);
  const {
    aid,
    title,
    trainerUid,
    trainerName,
    trainerPic,
    trainerPhone,
    photo,
    categories,
    description,
    about,
    price,
    location,
  } = Routerlocation.state;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    //Creates a chat id combining uids of both participants
    if (message !== "") {
      const chatid =
        user!.uid > trainerUid
          ? user!.uid + trainerUid
          : trainerUid + user!.uid;
      try {
        //Sets the partnert´s uid as well as chat id and ad id in the current user's "user_chats" table.
        const userchatsRef = doc(db, "user_chats", user!.uid);
        await setDoc(
          userchatsRef,
          {
            [trainerUid]: {
              chat_id: chatid,
              partner_uid: trainerUid,
              aid: aid,
            },
          },
          { merge: true }
        );
        //Sets the current user's uid as well as chat id and ad id in the partnerts's "user_chats" table.
        const trainerchatsRef = doc(db, "user_chats", trainerUid);
        await setDoc(
          trainerchatsRef,
          {
            [user!.uid]: {
              chat_id: chatid,
              partner_uid: user!.uid,
              aid: aid,
            },
          },
          { merge: true }
        );
        //Sets chat information in "chats" table
        const messagesRef = doc(db, "chats", chatid);
        await setDoc(
          messagesRef,
          {
            messages: arrayUnion({
              id: v4(),
              message,
              sender_uid: user!.uid,
              date: Timestamp.now(),
            }),
          },
          { merge: true }
        );
        setMessage("");
        toast.success("Ihre Nachricht wurde erfolgreich gesendet.", {
          duration: 3000,
        });
        setContacted(true);
      } catch (error) {
        toast.error("Fehler. Bitte probieren Sie noch Mal.");
      }
    }
  };

  return (
    <>
      <div className="ad_image">
        <img src={photo} alt={title} />
      </div>
      <div className="page_body">
        <div className="trainer">
          <div className="main_div">
            <h1>{title}</h1>
            <h3>Personal Trainer in {location}</h3>
            <div className="badges_div">
              {categories.map((cat: string) => (
                <div key={cat} className="badge">
                  {cat}
                </div>
              ))}
            </div>
            <div className="description_div">
              <h2>Über die Unterricht</h2>
              <hr />
              <p>{description}</p>
            </div>
            <div className="description_div">
              <h2>Über {trainerName}</h2>
              <hr />
              <p>{about}</p>
            </div>
          </div>
          <div className="second_div">
            <img
              className="avatar_photo"
              src={trainerPic !== undefined ? trainerPic : userData!.profilePic}
              alt={trainerName}
            />
            <h3>{trainerName}</h3>
            {trainerPhone !== undefined && (
              <div className="phone_div">
                <BsFillTelephoneFill />
                <h4>{trainerPhone}</h4>
              </div>
            )}
            <h2 className="price">{price}€/St.</h2>
            <div className="socialmedia_icons">
              <AiFillFacebook className="icon" />
              <AiFillInstagram className="icon" />
              <SlSocialTwitter className="icon" />
            </div>
            <hr />
            {trainerUid && (
              <div className="chat_widget">
                {!contacted && (
                  <>
                    <h3>Jetzt Buchen!</h3>
                    <p>
                      Jetzt {trainerName} kontaktieren und berraten zu lassen.
                    </p>
                    {user && (
                      <form onSubmit={(e) => handleSend(e)}>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={`Schreiben Sie Ihre Nachricht für ${
                            trainerName.split(" ")[0]
                          }.`}
                        ></textarea>
                        <button type="submit">Senden</button>
                      </form>
                    )}
                    {!user && (
                      <button onClick={() => setOpenModal(true)}>
                        Jetzt Trainer kontaktieren
                      </button>
                    )}
                  </>
                )}
                {contacted && (
                  <div className="message_sent">
                    <img src={done} alt="" />
                    Ihre Nachricht wurde erfolgreich gesendet. Sie können in
                    Ihrem persönlichen Nachrichtenbereich nachsehen.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <SignModal openModal={openModal} setOpenModal={setOpenModal} />
      </div>
    </>
  );
};

export default Trainer;