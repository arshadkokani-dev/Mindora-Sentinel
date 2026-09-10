import { useState } from 'react'
import EmotionWheel from './EmotionWheel'

function WellnessCheckin() {
  const [mood, setMood] = useState(5)
  const [energy, setEnergy] = useState(5)
  const [sleep, setSleep] = useState(5)
  const [stress, setStress] = useState(5)
  const [anxiety, setAnxiety] = useState(5)
  const [emotion, setEmotion] = useState('')
  const [journal, setJournal] = useState('')

  const [reflection, setReflection] = useState('')
  const [reflectionLoading, setReflectionLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()

  const token = localStorage.getItem('token')

  try {
    const response = await fetch(
      'http://localhost:5000/api/wellness',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood,
          energy,
          sleep,
          stress,
          anxiety,
          emotion,
          journal,
          date: new Date(),
        }),
      }
    )

    const data = await response.json()

    console.log(data)

    if (response.ok) {
      console.log('Wellness entry created successfully')

      setReflectionLoading(true)

      const aiResponse = await fetch(
        'http://localhost:5000/api/ai/reflection',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const aiData = await aiResponse.json()

      if (aiResponse.ok) {
        console.log('AI DATA:', aiData)
        console.log(
          'AI REFLECTION OBJECT:',
          aiData.reflection
        )

        let reflectionData = aiData.reflection

        if (typeof reflectionData === "string") {
          try {
            reflectionData = JSON.parse(reflectionData)
          } catch (error) {
            console.log("AI returned text instead of JSON. Using text response.")
          }
        }

        setReflection(reflectionData)
      } else {
        console.error(
          'Failed to generate AI reflection:',
          aiData
        )
      }

      setReflectionLoading(false)
    } else {
      console.error(
        'Failed to create wellness entry:',
        data
      )
    }
  } catch (error) {
    console.error(
      'Error creating wellness entry:',
      error
    )

    setReflectionLoading(false)
  }
}

  return (
    <div className="checkin-page">
      <div className="checkin-card">

        <p className="card-label">
          TODAY'S CHECK-IN
        </p>

        <h1>How are you feeling?</h1>

        <p className="checkin-subtitle">
          Take a moment to reflect on how you're doing today.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="metric">
            <label>
              Mood: {mood}/10
            </label>

            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) =>
                setMood(Number(e.target.value))
              }
            />
          </div>

          <div className="metric">
            <label>
              Energy: {energy}/10
            </label>

            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) =>
                setEnergy(Number(e.target.value))
              }
            />
          </div>

          <div className="metric">
            <label>
              Sleep: {sleep}/10
            </label>

            <input
              type="range"
              min="1"
              max="10"
              value={sleep}
              onChange={(e) =>
                setSleep(Number(e.target.value))
              }
            />
          </div>

          <div className="metric">
            <label>
              Stress: {stress}/10
            </label>

            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) =>
                setStress(Number(e.target.value))
              }
            />
          </div>

          <div className="metric">
            <label>
              Anxiety: {anxiety}/10
            </label>

            <input
              type="range"
              min="1"
              max="10"
              value={anxiety}
              onChange={(e) =>
                setAnxiety(Number(e.target.value))
              }
            />
          </div>

          {/* Emotion Wheel */}
          <EmotionWheel onSelect={setEmotion} />

          {/* Journal */}
          <div className="journal-section">
            <label htmlFor="journal">
              Journal
            </label>

            <textarea
              id="journal"
              value={journal}
              onChange={(e) =>
                setJournal(e.target.value)
              }
              placeholder="What's on your mind today?"
              rows="6"
            />
          </div>

          <button
            type="submit"
            className="primary-button"
          >
            Save Check-in
          </button>

        </form>
        
        {reflectionLoading && (
  <div className="ai-reflection">
    <p className="card-label">AI REFLECTION</p>
    <p>Reflecting on your check-in...</p>
  </div>
)}

        {reflection && (
  <div className="ai-reflection">
    <p className="card-label">AI REFLECTION</p>

    <h2>Your personal reflection</h2>

    {typeof reflection === "string" ? (
  <div className="reflection-text">
    {reflection
      .split(/\*\*(.*?)\*\*/)
      .filter((text) => text.trim() !== "")
      .map((text, index) => {
        const isHeading = index % 2 === 0;

        return isHeading ? (
          <h3 className="reflection-heading" key={index}>
            {text.trim()}
          </h3>
        ) : (
          <p className="reflection-paragraph" key={index}>
            {text.trim()}
          </p>
        );
      })}
  </div>
) : (
      <>
        <div className="reflection-item">
          <h3> What's showing up</h3>
          <p>{reflection.whatIsShowingUp}</p>
        </div>

        <div className="reflection-item">
          <h3> What you handled well</h3>
          <p>{reflection.whatTheyHandledWell}</p>
        </div>

        <div className="reflection-item">
          <h3> A thought to revisit</h3>
          <p>{reflection.thoughtToRevisit}</p>
        </div>

        <div className="reflection-item">
          <h3> Gentle next step</h3>
          <p>{reflection.gentleNextStep}</p>
        </div>
      </>
    )}
  </div>
)}

      </div>
    </div>
  )
}

export default WellnessCheckin