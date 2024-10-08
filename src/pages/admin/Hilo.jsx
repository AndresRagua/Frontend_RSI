import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar";

const API_URL = process.env.REACT_APP_API_URL;

// Función para transformar la URL de Dropbox
const transformDropboxUrl = (url) => {
  return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
};

function HiloMusical() {
  const [nombre, setNombre] = useState("");
  const [urlMusical, setUrlMusical] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [fkUsuario, setFkUsuario] = useState("");
  const [hilosMusicales, setHilosMusicales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editingHiloMusical, setEditingHiloMusical] = useState(null);
  const [editingFields, setEditingFields] = useState({
    id_hilo: "",
    nombre: "",
    urlMusical: "",
    urlImage: "",
    fkUsuario: ""
  });

  useEffect(() => {
    document.title = "Hilo Musical";
    fetchHilosMusicales();
    fetchUsuarios();
  }, []);

  const fetchHilosMusicales = async () => {
    const res = await axios.get(`${API_URL}/hilo_musical/`);
    setHilosMusicales(res.data);
  };

  const fetchUsuarios = async () => {
    const res = await axios.get(`${API_URL}/usuario/`);
    setUsuarios(res.data);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/hilo_musical/`, {
      nombre,
      url_musical: urlMusical,
      url_image: urlImage,
      fk_usuario: parseInt(fkUsuario)
    });
    fetchHilosMusicales();
    setNombre("");
    setUrlMusical("");
    setUrlImage("");
    setFkUsuario("");
    e.target.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingHiloMusical) {
      await axios.put(`${API_URL}/hilo_musical/${editingHiloMusical.id_hilo}`, {
        nombre: editingFields.nombre,
        url_musical: editingFields.urlMusical,
        url_image: editingFields.urlImage,
        fk_usuario: parseInt(editingFields.fkUsuario)
      });
      fetchHilosMusicales();
      setEditingHiloMusical(null);
      setEditingFields({
        id_hilo: "",
        nombre: "",
        urlMusical: "",
        urlImage: "",
        fkUsuario: ""
      });
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (hilo) => {
    setEditingFields({
      id_hilo: hilo.id_hilo,
      nombre: hilo.nombre,
      urlMusical: hilo.url_musical,
      urlImage: hilo.url_image,
      fkUsuario: hilo.fk_usuario
    });
    setEditingHiloMusical(hilo);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/hilo_musical/${id}`);
    fetchHilosMusicales();
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Navbar */}
      <AdminNavBar />

      <header className="mt-4 py-5 text-3xl font-bold text-gray-800 text-center">
        Administrar Hilos Musicales
      </header>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Formulario para agregar un nuevo hilo musical */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleAddSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Agregar Hilo Musical</h2>
            <input
              type="text"
              placeholder="Nombre del Hilo Musical"
              value={nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL del Musical"
              value={urlMusical}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlMusical(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL de la Imagen"
              value={urlImage}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setUrlImage(e.target.value)}
            />
            <select
              value={fkUsuario}
              onChange={(e) => setFkUsuario(e.target.value)}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona un Usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Guardar
            </button>
          </form>

          {/* Formulario para actualizar un hilo musical existente */}
          <form className="bg-white p-6 rounded-lg shadow-md mb-8 w-full lg:w-1/2" onSubmit={handleEditSubmit}>
            <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">Actualizar Hilo Musical</h2>
            <input
              type="text"
              placeholder="Nombre del Hilo Musical"
              value={editingFields.nombre}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL del Musical"
              value={editingFields.urlMusical}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlMusical: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de la Imagen"
              value={editingFields.urlImage}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={(e) => setEditingFields({ ...editingFields, urlImage: e.target.value })}
            />
            <select
              value={editingFields.fkUsuario}
              onChange={(e) => setEditingFields({ ...editingFields, fkUsuario: e.target.value })}
              className="block py-2 px-4 mb-4 w-full text-gray-700 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Selecciona un Usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300">
              Actualizar
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16">
        <div className="mt-8 w-full">
          <h2 className="text-3xl mb-4 font-bold text-gray-800 text-center">Lista de Hilos Musicales</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Musical</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Imagen</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Usuario</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {hilosMusicales.map((hilo) => (
                  <tr key={hilo.id_hilo}>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{hilo.id_hilo}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">{hilo.nombre}</td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <audio id="stream" controls preload="none" className="w-40 mx-auto">
                        <source src={transformDropboxUrl(hilo.url_musical)} type="audio/mpeg" />
                      </audio>
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      <img src={transformDropboxUrl(hilo.url_image)} alt="Imagen del Hilo Musical" className="w-40 h-24 object-cover rounded mx-auto" />
                    </td>
                    <td className="py-2 px-4 border-b text-center border-gray-200 text-gray-800">
                      {usuarios.find(usuario => usuario.id_usuario === hilo.fk_usuario)?.nombre}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-gray-800 text-center">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEdit(hilo)}
                          className="py-1 px-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(hilo.id_hilo)}
                          className="py-1 px-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-gray-600 text-center w-full py-4">
        <p>Derechos de Autor Reservados.</p>
        <p>Implementado por Dev Andres Ragua.</p>
      </footer>
    </div>
  );
}

export default HiloMusical;
