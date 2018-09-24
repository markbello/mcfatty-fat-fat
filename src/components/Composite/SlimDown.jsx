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
