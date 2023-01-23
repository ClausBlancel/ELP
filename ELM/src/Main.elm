module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, div, input, text)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)


-- MAIN

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }

-- MODEL

type alias Model = { content : String }

init : () -> ( Model, Cmd Msg )
init content =
    ({ content = "test" }
    , Cmd.none)


-- UPDATE

type Msg
    = Change String

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = 
    case msg of
        Change newContent ->
            ({ model | content = newContent }
            , Cmd.none)


-- VIEW
view : Model -> Html Msg
view model =
    div []
        [ input [ placeholder "Text to replicate", value model.content, onInput Change ] []
    , div [] [ text (model.content) ]
    ]

-- SUBSCRIPTIONS    

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none