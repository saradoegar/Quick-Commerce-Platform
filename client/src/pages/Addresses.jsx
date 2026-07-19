import { useMemo, useState, useEffect, useCallback } from 'react'
import { FiEdit2, FiHome, FiMapPin, FiPlus, FiTrash2 } from 'react-icons/fi'
import FeatureNav from '../components/FeatureNav'
import api from '../services/api'
import './Home.css'
import './UserFeatures.css'

const emptyAddress = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
}

const mapAddressToUI = (addr) => ({
  id: addr._id,
  label: addr.addressType || 'Home',
  name: addr.fullName,
  phone: addr.phone,
  line1: addr.addressLine1,
  line2: addr.addressLine2 || '',
  city: addr.city,
  state: addr.state,
  pincode: addr.postalCode,
  isDefault: addr.isDefault || false,
})

const mapAddressToBackend = (uiAddr) => ({
  fullName: uiAddr.name,
  phone: uiAddr.phone,
  addressLine1: uiAddr.line1,
  addressLine2: uiAddr.line2,
  city: uiAddr.city,
  state: uiAddr.state,
  postalCode: uiAddr.pincode,
  addressType: uiAddr.label,
  isDefault: uiAddr.isDefault,
})

function AddressCard({ address, onDelete, onEdit, onSetDefault }) {
  return (
    <article className="address-card">
      <div className="address-card-header">
        <span className="address-label">
          <FiMapPin />
          {address.label}
        </span>
        {address.isDefault ? <span className="default-pill">Default</span> : null}
      </div>
      <div>
        <h2>{address.name}</h2>
        <p>{address.phone}</p>
      </div>
      <p>
        {address.line1}, {address.line2 ? `${address.line2}, ` : ''}{address.city}, {address.state} -{' '}
        {address.pincode}
      </p>
      <div className="address-actions">
        <button className="soft-button" type="button" onClick={() => onEdit(address)}>
          <FiEdit2 /> Edit
        </button>
        {!address.isDefault && (
          <button className="light-button" type="button" onClick={() => onSetDefault(address.id)}>
            Set Default
          </button>
        )}
        <button className="danger-button" type="button" onClick={() => onDelete(address.id)}>
          <FiTrash2 /> Delete
        </button>
      </div>
    </article>
  )
}

function AddressForm({ editingAddress, onCancel, onSubmit }) {
  const initialForm = useMemo(() => editingAddress ?? emptyAddress, [editingAddress])
  const [form, setForm] = useState(initialForm)

  function updateField(event) {
    const { name, type, checked, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function submitForm(event) {
    event.preventDefault()
    onSubmit(form)
    setForm(emptyAddress)
  }

  return (
    <form className="address-form" onSubmit={submitForm}>
      <div className="address-card-header">
        <h2>{editingAddress ? 'Edit address' : 'Add address'}</h2>
        {editingAddress ? (
          <button className="light-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="label">Label</label>
          <select id="label" name="label" value={form.label} onChange={updateField}>
            <option>Home</option>
            <option>Office</option>
            <option>Hostel</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={updateField} required />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={updateField} required />
        </div>
        <div className="form-field">
          <label htmlFor="pincode">Pincode</label>
          <input
            id="pincode"
            name="pincode"
            value={form.pincode}
            onChange={updateField}
            required
          />
        </div>
        <div className="form-field full">
          <label htmlFor="line1">Address line 1</label>
          <input id="line1" name="line1" value={form.line1} onChange={updateField} required />
        </div>
        <div className="form-field full">
          <label htmlFor="line2">Address line 2</label>
          <input id="line2" name="line2" value={form.line2} onChange={updateField} />
        </div>
        <div className="form-field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" value={form.city} onChange={updateField} required />
        </div>
        <div className="form-field">
          <label htmlFor="state">State</label>
          <input id="state" name="state" value={form.state} onChange={updateField} required />
        </div>
      </div>
      <label className="checkbox-field">
        <input
          name="isDefault"
          type="checkbox"
          checked={form.isDefault}
          onChange={updateField}
        />
        Make this the default address
      </label>
      <button className="feature-button" type="submit">
        <FiPlus />
        {editingAddress ? 'Save Address' : 'Add Address'}
      </button>
    </form>
  )
}

function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [editingAddress, setEditingAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await api.addresses.getAll()
      if (res.data && res.data.data) {
        const mapped = res.data.data.map(mapAddressToUI)
        setAddresses(mapped)
      }
    } catch (err) {
      console.error('Failed to load addresses:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchAddresses()
    })
  }, [fetchAddresses])

  async function saveAddress(address) {
    try {
      if (address.id) {
        await api.addresses.update(address.id, mapAddressToBackend(address))
      } else {
        await api.addresses.create(mapAddressToBackend(address))
      }
      setEditingAddress(null)
      await fetchAddresses()
    } catch (err) {
      console.error('Failed to save address:', err)
    }
  }

  async function deleteAddress(addressId) {
    try {
      await api.addresses.delete(addressId)
      await fetchAddresses()
    } catch (err) {
      console.error('Failed to delete address:', err)
    }
  }

  async function setDefaultAddress(addressId) {
    try {
      await api.addresses.setDefault(addressId)
      await fetchAddresses()
    } catch (err) {
      console.error('Failed to set default address:', err)
    }
  }

  return (
    <div className="feature-shell">
      <FeatureNav />
      <section className="feature-hero">
        <div>
          <p className="eyebrow">
            <FiHome />
            Address management
          </p>
          <h1>Manage delivery addresses for quick checkout.</h1>
          <p>
            Add home, office, or hostel addresses and keep one default location ready
            for future order APIs.
          </p>
        </div>
        <span className="feature-hero-badge">{addresses.length} saved addresses</span>
      </section>

      <main className="feature-section address-layout">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#4f8f5f]"></div>
          </div>
        ) : (
          <div className="address-grid">
            {addresses.map((address) => (
              <AddressCard
                address={address}
                key={address.id}
                onDelete={deleteAddress}
                onEdit={setEditingAddress}
                onSetDefault={setDefaultAddress}
              />
            ))}
          </div>
        )}
        <AddressForm
          editingAddress={editingAddress}
          key={editingAddress?.id ?? 'new-address'}
          onCancel={() => setEditingAddress(null)}
          onSubmit={saveAddress}
        />
      </main>
    </div>
  )
}

export default Addresses
