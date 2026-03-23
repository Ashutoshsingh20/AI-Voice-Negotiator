import { useState } from 'react'
import './App.css'

interface NegotiationItem {
  id: string
  type: string
  provider: string
  currentPrice: number
  targetPrice: number
  status: 'pending' | 'negotiating' | 'success' | 'failed'
  savings?: number
}

function App() {
  const [items, setItems] = useState<NegotiationItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    provider: '',
    currentPrice: '',
    targetPrice: ''
  })

  const negotiationTypes = [
    'Subscription Service',
    'Internet/Cable Bill',
    'Phone Bill',
    'Insurance Premium',
    'Gym Membership',
    'Rent',
    'Other'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: NegotiationItem = {
      id: Date.now().toString(),
      type: formData.type,
      provider: formData.provider,
      currentPrice: parseFloat(formData.currentPrice),
      targetPrice: parseFloat(formData.targetPrice),
      status: 'pending'
    }
    setItems([...items, newItem])
    setFormData({ type: '', provider: '', currentPrice: '', targetPrice: '' })
    setShowForm(false)
    
    // Simulate AI negotiation
    setTimeout(() => {
      simulateNegotiation(newItem.id)
    }, 2000)
  }

  const simulateNegotiation = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'negotiating' } : item
    ))

    setTimeout(() => {
      setItems(prev => prev.map(item => {
        if (item.id === id) {
          const success = Math.random() > 0.3 // 70% success rate
          const finalPrice = success 
            ? item.targetPrice + (Math.random() * (item.currentPrice - item.targetPrice) * 0.3)
            : item.currentPrice
          
          return {
            ...item,
            status: success ? 'success' : 'failed',
            savings: success ? item.currentPrice - finalPrice : 0
          }
        }
        return item
      }))
    }, 5000)
  }

  const totalSavings = items
    .filter(item => item.status === 'success')
    .reduce((sum, item) => sum + (item.savings || 0), 0)

  const annualSavings = totalSavings * 12

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 AI Voice Negotiator</h1>
        <p className="tagline">Let AI negotiate better deals for you</p>
      </header>

      <div className="stats-card">
        <div className="stat">
          <span className="stat-label">Monthly Savings</span>
          <span className="stat-value">${totalSavings.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Annual Savings</span>
          <span className="stat-value">${annualSavings.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Active Negotiations</span>
          <span className="stat-value">{items.length}</span>
        </div>
      </div>

      <div className="main-content">
        {!showForm && (
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Add New Negotiation
          </button>
        )}

        {showForm && (
          <form className="negotiation-form" onSubmit={handleSubmit}>
            <h3>New Negotiation</h3>
            
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select type...</option>
                {negotiationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Provider/Company</label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Netflix, Verizon..."
                required
              />
            </div>

            <div className="form-group">
              <label>Current Monthly Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Target Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.targetPrice}
                onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-button">Start Negotiation</button>
              <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="items-list">
          {items.length === 0 && !showForm && (
            <div className="empty-state">
              <p>No negotiations yet</p>
              <p className="empty-hint">Click the button above to start saving money!</p>
            </div>
          )}

          {items.map(item => (
            <div key={item.id} className={`item-card status-${item.status}`}>
              <div className="item-header">
                <h4>{item.provider}</h4>
                <span className={`status-badge ${item.status}`}>
                  {item.status === 'pending' && '⏳ Pending'}
                  {item.status === 'negotiating' && '🤝 Negotiating...'}
                  {item.status === 'success' && '✅ Success'}
                  {item.status === 'failed' && '❌ Failed'}
                </span>
              </div>
              
              <p className="item-type">{item.type}</p>
              
              <div className="item-prices">
                <div className="price-info">
                  <span className="price-label">Current</span>
                  <span className="price-value">${item.currentPrice.toFixed(2)}</span>
                </div>
                <span className="price-arrow">→</span>
                <div className="price-info">
                  <span className="price-label">Target</span>
                  <span className="price-value">${item.targetPrice.toFixed(2)}</span>
                </div>
              </div>

              {item.status === 'success' && item.savings && (
                <div className="savings-info">
                  💰 Saving ${item.savings.toFixed(2)}/month (${(item.savings * 12).toFixed(2)}/year)
                </div>
              )}

              {item.status === 'failed' && (
                <div className="failed-info">
                  The provider declined. Try again later or adjust your target price.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>💡 Pro tip: AI negotiations work best with realistic target prices based on market rates</p>
      </footer>
    </div>
  )
}

export default App
