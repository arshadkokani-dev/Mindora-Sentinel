import { useState } from 'react'

function CBTJournal() {
  const [situation, setSituation] = useState('')
  const [thought, setThought] = useState('')
  const [emotion, setEmotion] = useState('')
  const [evidence, setEvidence] = useState('')
  const [alternative, setAlternative] = useState('')
  const [reflection, setReflection] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault()

  const token = localStorage.getItem('token')

  try {
    const response = await fetch('http://localhost:5000/api/cbt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        situation,
        thought,
        emotion,
        evidence,
        alternative,
        reflection,
        date: new Date(),
      }),
    })

    const data = await response.json()

    console.log('CBT journal response:', data)

    if (response.ok) {
      console.log('CBT journal saved successfully')
    } else {
      console.error('Failed to save CBT journal:', data.message)
    }
  } catch (error) {
    console.error('Error saving CBT journal:', error)
  }
}

  return (
    <div className="cbt-page">
      <div className="cbt-container">

        <div className="cbt-header">
          <p className="cbt-label">GUIDED REFLECTION</p>

          <h1>Reflect on your thoughts</h1>

          <p className="cbt-description">
            Take a few quiet minutes to understand what happened,
            how you felt, and how you can look at it differently.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="cbt-form">

          {/* Question 1 */}
          <div className="cbt-question">
            <label>
              <span className="question-number">01</span>
              What happened?
            </label>

            <p className="question-hint">
              Start by describing the situation or event.
            </p>

            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe the situation..."
            />
          </div>


          {/* Question 2 */}
          <div className="cbt-question">
            <label>
              <span className="question-number">02</span>
              What went through your mind?
            </label>

            <p className="question-hint">
              What automatic thought came to you?
            </p>

            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="What was your automatic thought?"
            />
          </div>


          {/* Question 3 */}
          <div className="cbt-question">
            <label>
              <span className="question-number">03</span>
              What emotion did you feel?
            </label>

            <p className="question-hint">
              Name the emotion you experienced.
            </p>

            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="e.g. anxious, angry, sad..."
            />
          </div>


          {/* Question 4 */}
          <div className="cbt-question">
            <label>
              <span className="question-number">04</span>
              What evidence supports that thought?
            </label>

            <p className="question-hint">
              What facts or experiences make you think this way?
            </p>

            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="What facts support your thought?"
            />
          </div>


          {/* Question 5 */}
          <div className="cbt-question">
            <label>
              <span className="question-number">05</span>
              Is there another way to look at it?
            </label>

            <p className="question-hint">
              Try looking at the situation from another perspective.
            </p>

            <textarea
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              placeholder="What is another possible perspective?"
            />
          </div>


          {/* Question 6 */}
          <div className="cbt-question">
            <label>
              <span className="question-number">06</span>
              What would you tell a friend?
            </label>

            <p className="question-hint">
              Imagine a friend was going through the same thing.
            </p>

            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What would you tell them?"
            />
          </div>


          <button type="submit" className="cbt-save-button">
            Save Reflection
          </button>

        </form>
      </div>
    </div>
  )
}

export default CBTJournal