#Part 1: Anti-Patterns in React Functional Components

Stateless/functional components as a React pattern ideally simplify your code. Ideally. I've seen some doozies though...

Front-end React in the wild is rarely the heavenly, best-practicing code we see in online tutorials and presentations at meetups. Every line is written for a reason, and among the head-scratchers I assume the reason was "I'm in a rush" or "I'll get back to it later" (which never comes).

This is Part One of a two-part exercise in therapeutic refactoring, where I'll point out some readability anti-patterns (as I see them). In Part Two I'll suggest some alternatives to feng shui a bloated functional component into something more elegant.

This refactoring should be a necessity rather than a luxury when working on business logic, because cognitive energy all comes from the same place- don't waste it trying to tease understanding out of a hairball component.

##About the Repo

I'll be working with pseudo-code on a `create-react-app` repo I lovingly named `mcfatty-fat-fat` because Functional Components are sometimes called "fat arrow functions." The code is commentary on my own eating habits. I dashed it off with errors and holes galore because *#writing-this-on-the-weekend* and also cuz the whole point is about inheriting less-than-perfect code.

The `Base` part has to do with the most reusable components and how excessive abstraction can lead to Hell in the file structure. The `Composite` part is in some ways a primal scream about anti-patterns I see in day-to-day life as an engineer. That's where we'll find the meat (and ice cream) of this post.

##The Base Component Library

Yay for reusable components! We're doing good with the relatively flat file structure before, but going into the danger zone on our `DatePicker` component.

[screenshot]

Our venture into `fs.Hell` begins with the effort it takes to determine which of these is even the top-level component. Does `Container` hold `DatePicker`? Or is `DatePicker` the parent? Is the pattern consistent between other `Base` components? Can I just get to coding already?

OK start coding. Don't forget to `import` everything with the correct relative paths! Hope you like counting dots...

This is a question of balance. Sometimes it makes sense to separate concerns, but the judgment call is how far apart those concerns actually are.

In a lot of cases, what looks pleasing to the component's author will cause the next engineer to spend a lot of effort tabbing between files, kind of like chasing the Gingerbread man. Treat engineer clicks like customer clicks: the fewer the better.

##The Composite Component

Refer to `<CheatDay />` and `<SlimDown />` side-by-side: both of them describe my guilty enjoyment of burgers and ice cream, but `<SlimDown />` has better intentions than `<CheatDay />` in terms of readability.

The `<CheatDay />` component has all the anti-patterns I'll discuss, and they're cleaned up in the `<SlimDown />` component. Let's start with anti-patterns from the top!

###Anti-Pattern: Ambivalent Prop De-structuring

The ambivalence is mostly mine. Sometimes it helps to be explicit about certain constants coming from props, like in `<CheatDay />`:

```jsx
const CheatDay = (props) => {
  const {
    items,
    healthWarnings,
    iAmSad,
    highFructoseCornSyrup,
  } = props;

  ...
```

Or you can be more DRY about it and de-structure the props upon entry, like in `<SlimDown />`:

```jsx
const CheatDay = ({
  items,
  healthWarnings,
  iAmSad,
  highFructoseCornSyrup,
  }) => {

  ...
```

The problem with this ambivalence is when multiple engineers touch the repo and treat this pattern like it's only a stylistic decision (which it mostly is). When multiple files lack consistency in this or other decisions (for instance, where to put PropTypes), that's when it gets hard to read.

###Anti-Pattern: Cryptic Booleans That Make You Wonder

```jsx
const overIndulge = iAmSad && items.mcDonalds.bigMac
  || items.mcDonalds.nuggets && healthWarnings.splice(0, 2).find('unheeded');
```

What a clever developer! 👏👏. #stackOverflowPoints

One of the first ways to clean this up would be to space it out into discrete, human-readable statements:

```jsx
const overIndulge =
  iAmSad &&
  items.mcDonalds.bigMac || items.mcDonalds.nuggets &&
  healthWarnings.splice(0, 2).find('unheeded');
```

We write code for people, not computers. Err on the side of semantics and don't make people think.

###Anti-Pattern: Declarations Living Far from Actual Usage

The next issue is how distant a declaration is from where it's actually used. Try finding where `overIndulge` does anything in `<CheatDay />`. Give up? Trick question: the engineer wrote it and never actually used it.

This is something a linter would pick up, but still instructive. Code is harder to read (and generally more error-prone) when functions and variables are declared far from where they're used.

In `<CheatDay />`, `const overIndulge` is defined on Line 13 and never used. If `overIndulge` was a factor in say, a `<PunishingMeal />` subcomponent, you could define it under the relevant namespace like in `<SlimDown />`:

```jsx
const PunishingMeal = () => {
  const overIndulge =
    iAmSad &&
    items.mcDonalds.bigMac || items.mcDonalds.nuggets &&
    healthWarnings.splice(0, 2).find('unheeded');

  return (
  <div className="classes more-classes flex">
    <h1 className="heading-six for-some-reason">
      {
        guiltyPleasures
      }
    </h1>
  </div>
  );
};
```

At this distance it's not hard to see how conditions about *whether* to `overIndulge` play no actual role in the makeup of my `<PunishingMeal />`.

###Anti-Pattern: Subverting Core HTML Properties with CSS

Let's say you need prominence on a screen reader for accessibility, but the UI calls for something smaller. So you do this quick-and-dirty thing:

```jsx
<div className="header super-stylish-header">
  <h1>Cheat Day is like, super healthy and stuff</h1>
  <span>Enjoy your { highFructoseCornSyrup }</span>
</div>
<div className="classes more-classes flex">
  <h1 className="heading-six for-some-reason">
    {
      guiltyPleasures
    }
  </h1>
</div>
```

In this example you have a couple of no-no's. To begin with, your page should only have one `<h1>` tag. Using an `<h1>` again and then formatting it as an `<h6>` is hacky. There are better ways to get visual styling to play along with accessibility, without making the next person think.

###Anti-Pattern: Complexity is More than a Performance Issue

Nested loops are often a clever trick that gets the job done when you're laser-focused on a particular component working like *right now*. Try revisiting the code in six weeks though. Take this clever piece of nonsense I dashed off:

```jsx
const guiltyPleasures = items
  .map(item => {
    const foodItems = Object.keys(item);
    const ingredients = foodItems.map(foodItem => foodItems[foodItem]);

    const ignoreFullness = () => {
      consume(highFructoseCornSyrup);
      iAmSad ? ignore(healthWarnings[0]) : ignore(healthWarnings[2]);

      ...
```

While the nested `map()` statements appear trivial at the time of writing, they add up to a confusing mess where suddenly all sorts of weird brackety shit (technical term) becomes justifiable.

This is where engineer performance becomes more of a problem. We talk about "Big O" considerations in coding interviews, but getting clever about how tersely we can jam out some code can cause serious readability problems for the humans who consume your components.

Considering that software engineers are notoriously bad with people, good code should prevent anyone from trying to read your mind.

###Anti-Pattern: Conditional Logic Inside of JSX

Here's an example of how being *able* to do something doesn't mean you *should* do something.

```JSX
/* eslint-disable no-unused-expressions */
return (
  do {
    if (iAmSad) {
      <Container>
        ...
      </Container>
    } else if (!iAmSad && items.häagenDazs) {
      <Container>
        ...
      </Container>
    } else {
      null
    }
  }
)
}
/* eslint-disable no-unused-expressions */
```

Manually disabling `eslint` in the first place is a red flag. But beyond that, where are the semantics? `Return do if`? What the Hell?

There's no good reason code can't more-or-less read like natural language, especially in React where we get to name things however we want. `return` (verb) `output` (noun). `做` (verb - "do") `什么` (noun - "something"). Works in English, Mandarin, Javascript, probably not PHP but that's a different conversation.

###Anti-Pattern: Obscure Patterns Because You're So Smart

Back to the example above:

```JSX
/* eslint-disable no-unused-expressions */
return (
  do {
    if (iAmSad) {
      <Container>
        ...
      </Container>
    } else if (!iAmSad && items.häagenDazs) {
      <Container>
        ...
      </Container>
    } else {
      null
    }
  }
)
}
/* eslint-disable no-unused-expressions */
```

The `do` block works, and I'm sure it has a place in JS- namely your side project.

I'm all about learning new functionality, new patterns, etc. I aspire to be Billy Badass senior dev passionate ninja cyborg from the future. Good for me!

When I'm writing code for pay though, I have to write it for the next engineer- in all likelihood the one who's doing it as a job more than a calling. There are more of them in the world than there are of me.

Using things like `static` methods, `context` above props, state, or Redux, `ref`s, etc. is clever. Look at you, Mr./Ms. Fancypants developer! You did a thing!

Also, whatever the Hell this is:

```JSX
{ iAmSad && <div
  className="confusing-logic mixed-in-view"
  position="bottom">
    <p>Treat yo-self! You deserve this for being you.</p>
</div>  }
```

Umm... what!? Isn't `&&` supposed to return `true` or `false`? This is only half a rhetorical question. Even if you can explain *why* or *how* this horrible thing works, the unexpected pattern causes friction for the next engineer trying to make heads or tails of the component.

Good code is something junior devs and indifferent old-timers can wrap their head around with minimal effort. The Golden Rule is "don't make people think". Respect the limits of other peoples' attention.

##Part 2: A Semantic Pattern for Simplifying Functional Components

Harnessing the power of hoisting (no longer just an interview question), you can rearrange a functional React component however you want by cutting it into smaller sections that flow from top to bottom. So for instance you can describe the overall structure of your component at the top of your component. When you first see it, it becomes a table of contents:

```JSX
const CheatDay = ({
  items,
  healthWarnings,
  iAmSad,
  highFructoseCornSyrup,
  }) => {

  const CheatDayComponent = () => (
    <Container className="bag paper-bag brown-paper-bag bag-xl">
      <CheatDayHeader />
      <PunishingMeal />
      <CheatDayFooter />
    </Container>
  );

  ...
```

Progressing downward, you then define the subcomponents from top to bottom:

```JSX
const CheatDayHeader = () => (
  <div className="header super-stylish-header">
    <h1>Cheat Day is like, super healthy and stuff</h1>
    <span>Enjoy your { highFructoseCornSyrup }</span>
  </div>
);

...
```

During the process, all of your props, etc. stay in scope because each subcomponent is a simple arrow function. When you're cutting the component into subcomponents like this, you can then encapsulate specific logic to bring it closer to where it's actually used, like this:

```JSX
const PunishingMeal = () => {
  const overIndulge =
    iAmSad &&
    items.mcDonalds.bigMac || items.mcDonalds.nuggets &&
    healthWarnings.splice(0, 2).find('unheeded');

  return (
    <div className="classes more-classes flex">
      <h1 className="heading-six for-some-reason">
        {
          guiltyPleasures
        }
      </h1>
    </div>
  );
};
```

Right here it becomes glaringly obvious that whether to `overIndulge` is not a factor in my `<PunishingMeal />` logic.

Then, dealing with funky conditional logic, you can swing `output` on a `let` variable:

```JSX
let output;

consume(highFructoseCornSyrup);
iAmSad ? ignore(healthWarnings[0]) : ignore(healthWarnings[2]);

if (iAmSad) {
  output = (
    <Container>
      <Input type={ items.mcDonalds }>
        ...
      </Input>
    </Container>
  );
}

if (!iAmSad && items.häagenDazs) {
  output = (
    <Container>
      <Input type={ items.häagenDazs }>
        ...
      </Input>
    </Container>
  );
};

return output || null;
```

Each `if` statement above can now read similar to natural language: `If I am sad, output equals ...`. Here we can easily tell that my love of ice cream transcends whether I'm sad. If it's around I'll eat it.

Otherwise, the return statement again reads like natural language: `return output or null`. This pattern makes it safe to remove conditional logic from JSX because it will simply do nothing if the `return` is `null`.

Next, by a similar pattern you can assign a semantic name to default content and change it on conditional logic:

```JSX
let footerContent = (
  <div
    className="default-excuse"
    position="bottom">
      <p>Treat yo-self! You deserve this for being you.</p>
  </div>
);

if (!iAmSad) {
  footerContent = (
    <div
      className="maybe-get-chopt"
      position="bottom">
        <ul>
          { healthWarnings.map(warning => (<li>{ warning }</li>)) }
        </ul>
    </div>
  );
};
```

In this case, I'm more likely to pay attention to health warnings and consider getting Chop't when I'm not sad. By default though, I'm going to give myself a flimsy excuse for overindulging when it's time for a `<CheatDay />`.

Wrapping it up, I can then return some very straightforward JSX that's easy to read:

```JSX
return (
  <div className="footer footerClasses">
    { footerContent }
  </div>
);
```

Finally when I'm done, I can simply `return` the top-level component as if it were any JS function:

```JSX
return <CheatDayComponent />;
```

At first the simplicity of the return statement could be a little jarring because it's unusual to see JSX outside of parens. The point here again is semantics- it's literally a natural language statement for what's happening here.

###And Here's the Whole Shebang

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Input } from '../Base';

const CheatDay = ({
  items,
  healthWarnings,
  iAmSad,
  highFructoseCornSyrup,
  }) => {

  const CheatDayComponent = () => (
    <Container className="bag paper-bag brown-paper-bag bag-xl">
      <CheatDayHeader />
      <PunishingMeal />
      <CheatDayFooter />
    </Container>
  );

  const CheatDayHeader = () => (
    <div className="header super-stylish-header">
      <h1>Cheat Day is like, super healthy and stuff</h1>
      <span>Enjoy your { highFructoseCornSyrup }</span>
    </div>
  );

  const PunishingMeal = () => {
    const overIndulge =
      iAmSad &&
      items.mcDonalds.bigMac || items.mcDonalds.nuggets &&
      healthWarnings.splice(0, 2).find('unheeded');

    return (
      <div className="classes more-classes flex">
        <h1 className="heading-six for-some-reason">
          {
            guiltyPleasures
          }
        </h1>
      </div>
    );
  };

  const guiltyPleasures = items.map(item => {
    const foodItems = Object.keys(item);
    const ingredients = foodItems.map(foodItem => foodItems[foodItem]);

    const ignoreFullness = () => {
      let output;

      consume(highFructoseCornSyrup);
      iAmSad ? ignore(healthWarnings[0]) : ignore(healthWarnings[2]);

      if (iAmSad) {
        output = (
          <Container>
            <Input type={ items.mcDonalds }>
              <ul>
                { items.mcDonalds.bigMac.map(ingredient => (
                  <li>
                    { ingredient }
                  </li>
                )) }
              </ul>
            </Input>
          </Container>
        );
      }

      if (!iAmSad && items.häagenDazs) {
        output = (
          <Container>
            <Input type={ items.häagenDazs }>
              <ul>
                { items.häagenDazs.iceCream.map(ingredient => (
                  <li>
                    { ingredient }
                  </li>
                )) }
              </ul>
            </Input>
          </Container>
        );
      };

      return output || null;
  });

  const CheatDayFooter = () => {
    let footerContent = (
      <div
        className="default-excuse"
        position="bottom">
          <p>Treat yo-self! You deserve this for being you.</p>
      </div>
    );

    if (!iAmSad) {
      footerContent = (
        <div
          className="maybe-get-chopt"
          position="bottom">
            <ul>
              { healthWarnings.map(warning => (<li>{ warning }</li>)) }
            </ul>
        </div>
      );
    };

    return (
      <div className="footer footerClasses">
        { footerContent }
      </div>
    );
  };

  return <CheatDayComponent />;
};

CheatDay.propTypes = {
  items: PropTypes.shape({
    mcDonalds: PropTypes.shape({
      bigMac: PropTypes.shape({
        allBeefPatties: PropTypes.array,
        specialSauce: PropTypes.mystery.isRequired,
        lettuce: PropTypes.vegetable,
        cheese: PropTypes.dairy,
        pickles: PropTypes.monster,
        onions: PropTypes.vegetable,
        sesameSeedBun: PropTypes.carbs,
      }),
      nuggets: PropTypes.shape({
        chickenProduct: PropTypes.mystery.isRequired,
        sauce: PropTypes.string.isRequired,
      }),
      fries: PropTypes.shape({
        potato: PropTypes.starch.isRequired,
        oil: PropTypes.oil.isRequired,
        salt: PropTypes.deliciousness,
      }).isRequired,
    }),
    häagenDazs: PropTypes.shape({
      iceCream: PropTypes.shape({
        ice: PropTypes.coldness.isRequired,
        cream: PropTypes.umami.isRequired,
      }).isRequired,
      toppings: PropTypes.shape({
        reeses: PropTypes.bestCandyEver,
        whippedCream: PropTypes.umami,
      })
    }),
  }),
  healthWarnings: PropTypes.array,
  iAmSad: PropTypes.boolean.isRequired,
  highFructoseCornSyrup: PropTypes.hazard.isRequired,
};
```
