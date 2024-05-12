import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import "./Plans.css";
import {
  collection,
  where,
  getDocs,
  query,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

const Plans = () => {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "customers", user.uid, "subscriptions"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        setSubscription({
          role: doc.data().role,
          current_period_end: doc.data().current_period_end.seconds,
          current_period_start: doc.data().current_period_start.seconds,
        });
      });
    };
    fetchData();
  }, [user.uid]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "products"), where("active", "==", true));

      const querySnapshot = await getDocs(q);
      const products = {};
      querySnapshot.forEach(async (doc) => {
        products[doc.id] = doc.data();

        const priceQuery = query(collection(doc.ref, "prices"));

        const priceSnap = await getDocs(priceQuery);
        priceSnap.docs.forEach((priceDoc) => {
          products[doc.id].prices = {
            priceId: priceDoc.id,
            priceData: priceDoc.data(),
          };
        });
      });
      setProducts(products);
    };
    fetchData();
  }, []);

  console.log(products);
  console.log(subscription);

  const loadCheckout = async (priceId) => {
    const docRef = await addDoc(
      collection(db, "customers", user.uid, "checkout_sessions"),
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    onSnapshot(docRef, async (snapshot) => {
      const { error, sessionId } = snapshot.data();

      if (error) {
        alert(`An error occurred: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51PEtSASGiGCUzHf9DwqfCDnKQCCUci4QymyS9Tq87f6JaER7An4z4Oz7RCvsitiiw7h3bwINC3xBiqF16gYSPR0D00sFlAPnJ5"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="plans">
      <br /> 
      {/* <div className="plansScreen_info">
        <h5>Basic Plan</h5>
        <h6>199</h6>
      </div>  <br /> 
      <div className="plansScreen_info">
        <h5>Standard Plan</h5>
        <h6>499</h6>
      </div>  <br /> 
      <div className="plansScreen_info">
        <h5>Premium Plan</h5>
        <h6>799</h6>
      </div> */}

      {subscription && (
        <p>
          Renewal Date:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "plansScreen_plan--disabled"
            } plansScreen_plan`}
          >
            <div className="plansScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Plans;
