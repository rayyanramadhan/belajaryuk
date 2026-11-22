-- Seed real MVP content for both tracks.
-- Content shape for lessons.content is documented in docs/content/lesson-content-shapes.md
-- (owned by the content-structurer subagent).

-- ============================================================
-- English track: "English Basics" course, 4 drill lessons.
-- ============================================================

with course as (
  insert into courses (track_id, title, description)
  select id, 'English Basics', 'Start speaking English with the everyday words and sentences you need first: greetings, simple verbs, and basic sentence building.'
  from tracks where slug = 'english'
  returning id
)
insert into lessons (course_id, position, kind, content)
select course.id, v.position, 'drill', v.content
from course, (values
  (1, '{
    "xp_reward": 10,
    "exercises": [
      {"type": "mcq", "prompt": "How do you greet someone in the morning?", "options": ["Good night", "Good morning", "Good evening", "Goodbye"], "correct_answer": "Good morning"},
      {"type": "mcq", "prompt": "How do you say \"hello\" formally?", "options": ["Hi", "Hello", "Yo", "Sup"], "correct_answer": "Hello"},
      {"type": "fill_blank", "prompt": "___ you! (reply when someone says thank you)", "correct_answer": "Welcome"},
      {"type": "mcq", "prompt": "Which phrase do you use when you meet someone for the first time?", "options": ["Nice to meet you", "See you later", "Good night", "Excuse me"], "correct_answer": "Nice to meet you"},
      {"type": "match_pairs", "prompt": "Match the greeting to when you use it.", "pairs": [
        {"left": "Good morning", "right": "Used before noon"},
        {"left": "Good afternoon", "right": "Used from noon to evening"},
        {"left": "Good night", "right": "Said before sleeping"}
      ]},
      {"type": "fill_blank", "prompt": "A: How are you? B: I am ___, thank you.", "correct_answer": "fine"}
    ]
  }'::jsonb),
  (2, '{
    "xp_reward": 10,
    "exercises": [
      {"type": "mcq", "prompt": "I ___ a student.", "options": ["am", "is", "are", "be"], "correct_answer": "am"},
      {"type": "fill_blank", "prompt": "She ___ a teacher.", "correct_answer": "is"},
      {"type": "mcq", "prompt": "They ___ happy.", "options": ["am", "is", "are", "be"], "correct_answer": "are"},
      {"type": "fill_blank", "prompt": "We ___ friends.", "correct_answer": "are"},
      {"type": "match_pairs", "prompt": "Match the pronoun to its \"to be\" form.", "pairs": [
        {"left": "I", "right": "am"},
        {"left": "He / She / It", "right": "is"},
        {"left": "You / We / They", "right": "are"}
      ]}
    ]
  }'::jsonb),
  (3, '{
    "xp_reward": 15,
    "exercises": [
      {"type": "mcq", "prompt": "Choose the correct verb: I ___ coffee every morning.", "options": ["drink", "drinks", "drinking", "drank"], "correct_answer": "drink"},
      {"type": "fill_blank", "prompt": "He ___ (go) to work by bus.", "correct_answer": "goes"},
      {"type": "mcq", "prompt": "Which sentence is correct?", "options": ["She have a car.", "She has a car.", "She having a car.", "She is has a car."], "correct_answer": "She has a car."},
      {"type": "fill_blank", "prompt": "We ___ (like) learning English.", "correct_answer": "like"},
      {"type": "mcq", "prompt": "I ___ my homework every day.", "options": ["do", "does", "doing", "did"], "correct_answer": "do"},
      {"type": "fill_blank", "prompt": "They ___ (play) football on weekends.", "correct_answer": "play"}
    ]
  }'::jsonb),
  (4, '{
    "xp_reward": 15,
    "exercises": [
      {"type": "mcq", "prompt": "Which is a complete sentence?", "options": ["Running fast.", "The dog runs fast.", "Fast dog.", "Runs the dog."], "correct_answer": "The dog runs fast."},
      {"type": "fill_blank", "prompt": "My name ___ Sarah.", "correct_answer": "is"},
      {"type": "mcq", "prompt": "Pick the correct question form.", "options": ["You are from where?", "Where you are from?", "Where are you from?", "From where are you?"], "correct_answer": "Where are you from?"},
      {"type": "fill_blank", "prompt": "I ___ live in Jakarta.", "correct_answer": "do"},
      {"type": "match_pairs", "prompt": "Match the question to its answer.", "pairs": [
        {"left": "What is your name?", "right": "My name is Sarah."},
        {"left": "Where are you from?", "right": "I am from Indonesia."},
        {"left": "How old are you?", "right": "I am twenty-five years old."}
      ]}
    ]
  }'::jsonb)
) as v(position, content);

-- ============================================================
-- Parenting track: "Newborn Essentials" course, 3 video_quiz lessons.
-- ============================================================

with course as (
  insert into courses (track_id, title, description)
  select id, 'Newborn Essentials', 'Practical, evidence-based guidance for the first weeks with a newborn: safe sleep, feeding basics, and soothing a crying baby.'
  from tracks where slug = 'parenting'
  returning id
)
insert into lessons (course_id, position, kind, content)
select course.id, v.position, 'video_quiz', v.content
from course, (values
  (1, '{
    "video": {
      "title": "Safe Sleep Basics",
      "url": "placeholder://videos/safe-sleep-basics.mp4",
      "duration_seconds": 240
    },
    "quiz": {
      "pass_threshold": 0.75,
      "questions": [
        {"prompt": "What is the safest sleep position for a newborn?", "options": ["On their stomach", "On their back", "On their side", "Any position is fine"], "correct_answer": "On their back"},
        {"prompt": "What should be kept OUT of the crib with a sleeping newborn?", "options": ["A fitted sheet", "Soft toys, pillows, and loose blankets", "The mattress", "Nothing, the crib should be empty except the mattress and sheet"], "correct_answer": "Soft toys, pillows, and loose blankets"},
        {"prompt": "Where is the recommended place for a newborn to sleep for at least the first 6 months?", "options": ["In their own room, in their own crib", "In the parents room, in their own crib or bassinet", "In the bed with the parents", "In a car seat"], "correct_answer": "In the parents room, in their own crib or bassinet"},
        {"prompt": "What room temperature helps reduce the risk of overheating during sleep?", "options": ["A cool, comfortable room temperature", "As warm as possible", "It does not matter", "Only matters in winter"], "correct_answer": "A cool, comfortable room temperature"}
      ]
    }
  }'::jsonb),
  (2, '{
    "video": {
      "title": "Feeding Basics: Breast, Bottle, and Cues",
      "url": "placeholder://videos/feeding-basics.mp4",
      "duration_seconds": 300
    },
    "quiz": {
      "pass_threshold": 0.75,
      "questions": [
        {"prompt": "How often do most newborns need to feed in a 24-hour period?", "options": ["2-3 times", "4-5 times", "8-12 times", "Only when they cry loudly"], "correct_answer": "8-12 times"},
        {"prompt": "Which is an early hunger cue to watch for?", "options": ["Rooting or sucking on hands", "Crying loudly", "Falling asleep suddenly", "Arching the back"], "correct_answer": "Rooting or sucking on hands"},
        {"prompt": "What is a good sign a newborn is getting enough milk?", "options": ["They cry after every feed", "Steady weight gain and regular wet/dirty diapers", "They sleep through every feed", "They feed for less than a minute"], "correct_answer": "Steady weight gain and regular wet/dirty diapers"},
        {"prompt": "If bottle feeding, what is recommended to reduce overfeeding and gas?", "options": ["Feeding as fast as possible", "Paced bottle feeding with breaks", "Only feeding when fully silent", "Adding cereal to the bottle"], "correct_answer": "Paced bottle feeding with breaks"}
      ]
    }
  }'::jsonb),
  (3, '{
    "video": {
      "title": "Soothing a Crying Baby",
      "url": "placeholder://videos/soothing-crying-baby.mp4",
      "duration_seconds": 270
    },
    "quiz": {
      "pass_threshold": 0.75,
      "questions": [
        {"prompt": "What should you check first when a newborn cries?", "options": ["Basic needs: hunger, a dirty diaper, or tiredness", "Whether they are spoiled", "If they are too cold only", "Nothing, let them cry it out"], "correct_answer": "Basic needs: hunger, a dirty diaper, or tiredness"},
        {"prompt": "Which soothing technique mimics the womb and can calm a newborn?", "options": ["Loud music", "Swaddling and gentle rocking", "Bright lights", "Leaving them alone in a quiet dark room"], "correct_answer": "Swaddling and gentle rocking"},
        {"prompt": "What should you do if you feel overwhelmed and the baby keeps crying?", "options": ["Shake the baby gently to calm them", "Place the baby safely in the crib and take a short break", "Never put the baby down, no matter what", "Yell to relieve stress"], "correct_answer": "Place the baby safely in the crib and take a short break"},
        {"prompt": "Is it normal for newborns to have a daily period of increased crying (e.g. evenings)?", "options": ["No, it always means something is wrong", "Yes, this is common and often called the \"witching hour\"", "Only if the baby is unwell", "Only for bottle-fed babies"], "correct_answer": "Yes, this is common and often called the \"witching hour\""}
      ]
    }
  }'::jsonb)
) as v(position, content);
