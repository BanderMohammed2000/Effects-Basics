import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces") || []);
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // useEffect: يتم تنفيذها اخر شيء يعد مايتم تنفيذ كل مافي المكون!
  // ملاحظة مهمة: use Effect لايتم تنفيذه مرة اخرى (في حالة اعادة تنفيذ المكون) الا اذا تغير قيمة الباراميتر الثاني الذي فيه
  // في حال ماوضعنا باراميتر ثاني, راح يتم تنفذ useEffect في كل مرة رياكت يحدث المكون
  // useEffect: لانستخدمه الا اذا احتجنا اليه فعلاً لأن غير غير ذلك سيعتبر ممارسة سيئة
  // ليس في كل الاكواد التي تفعل تأثير جانبي نستخدم معاها useEffect .. الاستخدام الاساسي له هو لمنع اللوب اللانهائي او اذا كان لدينا كود نريد تنفيذه مرة وحدة على الاقل بعد تنفيذ كل الاشياء الاخرى التي بداخل المكون
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const storedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(storedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // في local storage لايمكن تخزين فيه مصفوفة اوا كائن, اذا اردنا ذلك فيجب تحويله الى سلسلة نصية
    // على الرغم من هذه الاكواد ذات تأثير جانبي الا اننا لم نحتاج وضعها داخل useEffect وذلك بسبب:
    // لايمكننا وضعنا احد Hooks داخل دالة داخلية
    // واساساً ماراح يتم تنفيذ هذا الكود الا عندما يتم تنفيذ هذه الدالة والتي راح تنفذ عندما المستخدم ينقر على احدى الاماكن

    // ليس في كل الاكواد التي تفعل تأثير جانبي نستخدم معاها useEffect .. الاستخدام الاساسي له هو لمنع اللوب اللانهائي او اذا كان لدينا كود نريد تنفيذه مرة وحدة على الاقل بعد تنفيذ كل الاشياء الاخرى التي بداخل المكون

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  // useCallback
  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting placing by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
