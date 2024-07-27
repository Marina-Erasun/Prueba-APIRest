import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Modal from 'react-modal';
import "./Women.css";

const ListWomen = () => {
  const [women, setWomen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWomen, setNewWomen] = useState({
    name: "",
    lastName: "",
    nationality: "",
    bio: "",
    photo: "",
  });
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    lastName: "",
    nationality: "",
    bio: "",
    photo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchWomen = async () => {
      try {
        const response = await fetch("https://66562e799f970b3b36c48e76.mockapi.io/women");
        const result = await response.json();
        setWomen(result);
        setLoading(false);
      } catch (error) {
        Swal.fire("Error!", "Hubo un error al traer las mujeres", "error");
        setLoading(false);
      }
    };
    fetchWomen();
  }, []);

  const openModal = (woman) => {
    setEditData(woman);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditData({
      id: "",
      name: "",
      lastName: "",
      nationality: "",
      bio: "",
      photo: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (showModal) {
      setEditData({
        ...editData,
        [name]: value,
      });
    } else {
      setNewWomen({
        ...newWomen,
        [name]: value,
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { id, name, lastName, nationality, bio, photo } = editData;
    const updateWomen = { id, name, lastName, nationality, bio, photo };

    try {
      const response = await fetch(`https://66562e799f970b3b36c48e76.mockapi.io/women/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateWomen),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWomen(women.map((woman) => (woman.id === id ? data : woman)));
      Swal.fire({ text: "La mujer ha sido actualizada con éxito", icon: "success" })
        .then((result) => {
          if (result.isConfirmed) {
            closeModal();
          }
        });
    } catch (error) {
      Swal.fire({ text: "La mujer no pudo ser actualizada. Verifique estar logueado.", icon: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://66562e799f970b3b36c48e76.mockapi.io/women", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWomen),
      });
      const result = await response.json();
      if (response.ok) {
        setWomen([...women, result]);
        Swal.fire({ text: "Mujer agregada con éxito", icon: "success" });
        setNewWomen({ name: "", lastName: "", nationality: "", bio: "", photo: "" });
      } else {
        Swal.fire("Error!", "Hubo un error al crear la mujer", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Hubo un error al crear la mujer", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      html: "<span class='custom-swal-title'>¿Está seguro de eliminar el registro?</span>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo eliminarlo",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://66562e799f970b3b36c48e76.mockapi.io/women/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Algo salió mal");
        }

        setWomen((prevWomen) => prevWomen.filter((t) => t.id !== id));
        Swal.fire({ text: "La mujer ha sido eliminada.", icon: "success" });
      } catch (error) {
        Swal.fire({ text: `Error al enviar la solicitud: ${error.message}`, icon: "error" });
      }
    }
  };

  const filteredWomen = women.filter((woman) =>
    woman.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="barra-superior">
        <h2 className="titulo-section">LISTADO DE MUJERES</h2>
      </div>
      <form onSubmit={handleSubmit} className="women-form">
        <input
          type="text"
          name="name"
          value={newWomen.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="lastName"
          value={newWomen.lastName}
          onChange={handleChange}
          placeholder="Apellido"
          required
        />
        <input
          type="text"
          name="nationality"
          value={newWomen.nationality}
          onChange={handleChange}
          placeholder="Nacionalidad"
          required
        />
        <textarea
          name="bio"
          value={newWomen.bio}
          onChange={handleChange}
          placeholder="Biografía"
          required
        />
        <input
          type="text"
          name="photo"
          value={newWomen.photo}
          onChange={handleChange}
          placeholder="Foto"
          required
        />
        <button type="submit">Crear</button>
      </form>

      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Nacionalidad</th>
              <th>Biografía</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredWomen.map((woman) => (
              <tr key={woman.id}>
                <td>{woman.name}</td>
                <td>{woman.lastName}</td>
                <td>{woman.nationality}</td>
                <td>{woman.bio}</td>
                <td><img src={woman.photo} alt={woman.name} style={{ width: "50px", height: "50px" }} /></td>
                <td>
                  <div className="btn-container">
                    <button className="edit-button" onClick={() => openModal(woman)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button onClick={() => handleDelete(woman.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        className="formContainerModal"
        isOpen={showModal}
        onRequestClose={closeModal}
      >
        <form className="formModal" onSubmit={handleSave}>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            name="lastName"
            value={editData.lastName}
            onChange={handleChange}
          />
          <label htmlFor="nationality">Nacionalidad</label>
          <input
            type="text"
            name="nationality"
            value={editData.nationality}
            onChange={handleChange}
          />
          <label htmlFor="bio">Biografía</label>
          <input
            type="text"
            name="bio"
            value={editData.bio}
            onChange={handleChange}
          />
          <label htmlFor="photo">Foto</label>
          <input
            type="text"
            name="photo"
            value={editData.photo}
            onChange={handleChange}
          />
          <div className="btn-container">
            <button className="btn" type="submit">Guardar</button>
            <button className="btn" type="button" onClick={closeModal}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ListWomen;

